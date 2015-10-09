import recorder from "tape-recorder";

import { requireLogin } from "../middlewares/auth";
import { requireValidAccount } from "../middlewares/account";

export default (app) => {

  app.get("/api/accounts/:accountId/rooms",
    requireLogin, requireValidAccount,
    (req, res) => {
      req.io.route("rooms:list");
    });

  app.put("/api/accounts/:accountId/rooms/",
    requireLogin, requireValidAccount,
    (req) => {
      req.io.route("rooms:create");
    });

  app.io.route("rooms", {
    list(req, res) {
      const Room = recorder.model("Room");
      Room.where("accountId", { key: req.params.accountId })
        .then(rooms => {
          const { user } = req;
          rooms = rooms.filter(room => {
            return room.public || room.private && room.usersId.indexOf(user.id) !== -1;
          }).map(room => {
            return room.toAPI(user.id === room.adminId);
          });

          res.json({
            ok: true,
            rooms: rooms
          });
        }, error => {
          res.json({
            ok: false,
            errors: error
          });
        });
    },

    create(req, res) {
      const Room = recorder.model("Room");
      const { name, topic, type, usersId } = req.body;
      const accountId = req.params.accountId;
      const { user, account } = req;

      if (!account.userBelongTo(user.id)) {
        return res.json({
          ok: false,
          message: `You are not allowed to create a room in this account.`
        });
      }

      let room = new Room({
        name,
        topic,
        type,
        accountId: accountId,
        usersId,
        adminId: user.id
      });

      room.save().then(newRoom => {
        res.status(201).json({
          ok: true,
          message: `Room '${name}' has been successfully created`,
          room: newRoom.toAPI(true)
        });
      }, error => {
        res.json({
          ok: false,
          message: `Creation of new room failed.`,
          errors: error
        });
      });
    }
  });
};
