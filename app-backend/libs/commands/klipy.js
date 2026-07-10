import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";
import config from "../../config";

const { klipy } = config.plugins;

export function setup(app) {
    const API_KEY = klipy.api_key;
    if (!API_KEY) {
        throw new Error(
            "Klipy Composer Plugin: missing required 'api_key' in settings.",
        );
    }
    console.log(`Loading Klipy GIF command with API_KEY: ${API_KEY}`);

    app.get("/api/command/klipy/search", requireLogin, (req, res) => {
        const query = req.query.q || "";
        const url = new URL(
            `https://api.klipy.com/api/v1/${API_KEY}/gifs/search`,
        );
        url.searchParams.append("q", query);
        url.searchParams.append("per_page", "10");
        url.searchParams.append("customer_id", req.user.id);
        fetch(url.toString())
            .then((response) => response.json())
            .then((json) => {
                res.json({
                    ok: true,
                    results: json.data.data.map((r) => ({
                        preview: r.file.md.gif.url,
                        url: r.file.hd.webp.url,
                        title: r.title,
                    })),
                });
            })
            .catch((err) => {
                console.error(err);
                res.json({
                    ok: false,
                    results: [],
                });
            });
    });
}
