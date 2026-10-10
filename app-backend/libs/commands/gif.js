import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";

const ENDPOINT = "https://bkt-2q9.pages.dev/";
const ALL_IMAGES = new URL("/images.json", ENDPOINT).toString();

function normalize(value) {
    return value
        .normalize("NFKD")
        .replace(/\p{Diacritic}/gu, "")
        .toLocaleLowerCase("en")
        .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
        .trim();
}

export function setup(app) {
    console.log("Loading Buukkit GIF command");
    app.get("/api/command/gif/search", requireLogin, (req, res) => {
        const normalizedQuery = normalize(req.query.q || "");
        const queryWords = normalizedQuery.split(" ").filter(Boolean);

        fetch(ALL_IMAGES)
            .then((response) => response.json())
            .then((results) =>
                res.json({
                    ok: true,
                    results: results.images
                        .map((image) => {
                            const normalizedName = normalize(image.name);
                            let score =
                                normalizedName === normalizedQuery ? 1_000 : 0;

                            if (
                                !queryWords.every((word) =>
                                    normalizedName.includes(word),
                                )
                            ) {
                                return null;
                            }

                            for (const queryWord of queryWords) {
                                score += image.keywords.includes(queryWord)
                                    ? 40
                                    : 0;
                                score += image.keywords.some((word) =>
                                    word.startsWith(queryWord),
                                )
                                    ? 15
                                    : 0;
                            }

                            return { image, score };
                        })
                        .filter(Boolean)
                        .sort(
                            (left, right) =>
                                right.score - left.score ||
                                left.image.name.localeCompare(right.image.name),
                        )
                        .map(({ image }) => {
                            const url = new URL(image.url, ENDPOINT).toString();
                            return {
                                preview: url,
                                url: url,
                                title: image.filename,
                            };
                        }),
                }),
            )
            .catch((err) => {
                console.error(err);
                res.json({
                    ok: false,
                    results: [],
                });
            });
    });
}
