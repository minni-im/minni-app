import path from "path";
import moment from "moment";
import config from "./config";

export default {
  setup(app) {
    app.use((req, res, next) => {
      Object.assign(res.locals, {
        name: config.name,
        viewname(filename) {
          return path.basename(filename, ".jade");
        },
        hash: (function () {
          try {
            return require("../dist/public/js/manifest.json");
          } catch (exception) {
            return {};
          }
        }()),
        user: req.user,
        production: process.env.NODE_ENV === "production",
        nth(rank) {
          rank = Math.max(1, rank);
          const ranks = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
          if (rank in [11, 12, 13]) {
            // Only works for ranks below 100
            return rank + ranks[0];
          }
          return rank + ranks[rank % 10];
        },
        url: {
          hostname: req.hostname,
          protocol: req.protocol
        },
        moment
      });

      next();
    });
  }
};
