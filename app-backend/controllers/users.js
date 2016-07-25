import recorder from "tape-recorder";
import { requireLogin } from "../middlewares/auth";

export default (app) => {
  app.get("/users",
    requireLogin,
    (req) => {
      req.io.route("users:list");
    });

  app.get("/users/:id",
    requireLogin,
    (req) => {
      req.io.route("users:get");
    });

  app.io.route("users", {
    list(req, res) {
      // TODO to be implemented
    },

    get(req, res) {
      const userId = req.params.id;
      const User = recorder.model("User");

      User.findById(userId)
        .then((user) => {
          if (!user) {
            res.sendStatus(404);
            return;
          }
          res.json(user.toAPI(req.user.id === userId));
        }, (error) => {
          console.error(error);
          res.status(400).json(error);
        });
    },

    presence(req) {
      if (!req.isSocket) return;
      const { userId, status, accountIds } = req.data;
      req.socket.status = status;
      accountIds.forEach(accountId => {
        req.socket.broadcast.to(accountId).emit("users:presence", {
          userId,
          accountId,
          status
        });
      });
    }
  });
};
