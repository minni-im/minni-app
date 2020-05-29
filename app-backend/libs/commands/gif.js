import fetch from "node-fetch";
import { requireLogin } from "../../middlewares/auth";

export function setup(app) {
  console.log("Loading Buukkit GIF command");
  app.get("/api/command/gif/search", requireLogin, (req, res) => {
    const query = req.query.q || "";
    fetch(
      `https://buukkit.appspot.com/json/search/${encodeURIComponent(query)}`
    )
      .then((response) => response.json())
      .then((results) =>
        res.json({
          ok: true,
          results: results.images.map((image) => ({
            preview: image,
            url: image,
            title: image.split("/").pop(),
          })),
        })
      );
  });
}
