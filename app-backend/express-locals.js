import path from "path";
import moment from "moment";
import config from "./config";

const backgrounds = config["login-backgrounds"];

const START_TS = Date.now();

export default {
  setup(app) {
    app.use((req, res, next) => {
      Object.assign(res.locals, {
        START_TS,
        demo: config.demo,
        name: config.name,
        viewname(filename) {
          return path.basename(filename, ".pug");
        },
        hash: (function () {
          try {
            return require("../public/js/manifest.json"); // eslint-disable
          } catch (exception) {
            return {};
          }
        })(),
        user: req.user,
        production: process.env.NODE_ENV === "production",
        nth(rank) {
          rank = Math.max(1, rank);
          const ranks = [
            "th",
            "st",
            "nd",
            "rd",
            "th",
            "th",
            "th",
            "th",
            "th",
            "th",
          ];
          if (rank in [11, 12, 13]) {
            // Only works for ranks below 100
            return rank + ranks[0];
          }
          return rank + ranks[rank % 10];
        },
        url: {
          hostname: req.hostname,
          protocol: req.protocol,
        },
        moment,
        background: () =>
          backgrounds[Math.floor(Math.random() * backgrounds.length)],
      });

      next();
    });
  },
};
