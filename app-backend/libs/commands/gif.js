import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";

const ENDPOINT = "https://bkt-2q9.pages.dev/";
const ALL_IMAGES = new URL("/images.json", ENDPOINT);

export function setup(app) {
    console.log("Loading Buukkit GIF command");
    app.get("/api/command/gif/search", requireLogin, (req, res) => {
        const query = req.query.q || "";
        fetch(ALL_IMAGES)
            .then((response) => response.json())
            .then((results) =>
                res.json({
                    ok: true,
                    results: results.images
                        .filter((image) =>
                            image.keywords.some((keyword) =>
                                keyword.includes(query),
                            ),
                        )
                        .map((image) => {
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
