import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";

export function setup(app) {
    console.log("Loading Buukkit GIF command");
    app.get("/api/command/gif/search", requireLogin, (req, res) => {
        const query = req.query.q || "";
        fetch("https://bkt-2q9.pages.dev/images.json")
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
                        .map((image) => ({
                            preview: image.url,
                            url: image.url,
                            title: image.filename,
                        })),
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
