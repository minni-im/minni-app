import extend from "deep-extend";
import recorder from "tape-recorder";

import { requireLogin } from "../middlewares/auth";
import { requireValidAccount } from "../middlewares/account";
import { requireValidRoom } from "../middlewares/room";

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

  app.post("/api/rooms/:roomId/star", requireLogin, requireValidRoom, (req) => {
    req.io.route("rooms:star");
  });

  app.post("/api/rooms/:roomId/unstar", requireLogin, requireValidRoom, (req) => {
    req.io.route("rooms:unstar");
  });

  app.get("/api/rooms/:roomId/messages", requireLogin, requireValidRoom, (req) => {
    req.io.route("rooms:messages");
  });

  app.io.route("rooms", {
    star(req, res) {
      const { room, user } = req;
      let { settings } = user;
      if (!settings.starred) {
        settings.starred = { rooms: [] };
      }
      let { rooms } = user.settings.starred;

      if (rooms.indexOf(room.id) === -1) {
        rooms.push(room.id);
      }

      user.save().then(newUser => {
        res.json({
          ok: true,
          message: `Room '${room.name}' has been starred`
        });
      }, error => {
        res.json({
          ok: false,
          message: `We did not managed to star the room. Please try again later.`,
          errors: error
        });
      });
    },

    unstar(req, res) {
      const { room, user } = req;
      let { rooms } = user.settings.starred;
      if (!rooms || (rooms && rooms.indexOf(room.id) === -1)) {
        return res.json({
          ok: true,
          message: "Nothing to be done."
        });
      }

      rooms = rooms.splice(rooms.indexOf(room.id), 1);

      user.save().then(newUser => {
        res.json({
          ok: true,
          message: `Room '${room.name}' has been unstarred`
        });
      }, error => {
        res.json({
          ok: false,
          message: `We did not managed to unstar the room. Please try again later.`,
          errors: error
        });
      });
    },

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
    },

    messages(req, res) {
      const Message = recorder.model("Message");
      const { roomId } = req.params;
      console.log(`Fetching messages for room:${roomId}`);
      Message.getHistory(roomId)
        .then(messages => {
          res.json({
            ok: true,
            messages: messages.map(message => message.toAPI())
          });
        }, error => {
          res.json({
            ok: false,
            message: `Fetching messages for room:${roomId} failed`,
            errors: error
          });
        });
    },

    join(req) {
      const params = req.isSocket ? req.data : req.params;
      const { accountSlug, roomSlug } = params;
      const roomKey = `${accountSlug}:${roomSlug}`;
      console.log(`'${req.user.id}' is joining '${roomKey}'`);

      req.socket.join(roomKey);
      // req.socket.room(accountSlug).broadcast("users:join", { user: req.user, accountSlug, roomSlug });
    },

    leave(req) {
      const params = req.isSocket ? req.data : req.params;
      const { accountSlug, roomSlug } = params;
      const roomKey = `${accountSlug}:${roomSlug}`;
      console.log(`'${req.user.id}' is leaving '${roomKey}'`);
      req.socket.leave(roomKey);
    }
  });
};
