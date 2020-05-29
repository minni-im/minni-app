import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";
import config from "../../config";

const { tenor } = config.plugins;

export function setup(app) {
  const API_KEY = tenor.api_key;
  if (!API_KEY) {
    throw new Error(
      "Tenor Composer Plugin: missing required 'api_key' in settings."
    );
  }
  console.log(`Loading Tenor GIF command with API_KEY: ${API_KEY}`);

  app.get("/api/command/tenor/search", requireLogin, (req, res) => {
    const query = req.query.q || "";
    fetch(
      `https://api.tenor.com/v1/search?q=${encodeURIComponent(
        query
      )}&key=${API_KEY}&limit=10`
    )
      .then((response) => response.json())
      .then((data) => {
        res.json({
          ok: true,
          results: data.results.map((r) => ({
            preview: r.media[0].mediumgif.url,
            url: r.itemurl,
            title: r.title || r.itemurl.split("/").pop(),
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
