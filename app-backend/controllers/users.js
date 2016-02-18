import recorder from "tape-recorder";
import { requireLogin } from "../middlewares/auth";

export default (app) => {
  app.get("/users", requireLogin, function(req) {
    req.io.route("users:list");
  });

  app.get("/users/:id", requireLogin, function(req) {
    req.io.route("users:get");
  });

  app.io.route("users", {
    list(req, res) {

    },

    get(req, res) {
      const userId = req.params.id;
      const User = recorder.model("User");

      User.findById(userId)
        .then((user) => {
          if (!user) {
            return res.sendStatus(404);
          }
          res.json(user.toAPI(req.user.id === userId));
        }, (error) => {
          console.error(error);
          res.status(400).json(error);
        });
    }
  });
};
