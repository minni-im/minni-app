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

  app.post("/api/rooms/:roomId/typing", requireLogin, requireValidRoom, (req) => {
    req.io.route("rooms:typing");
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
      const { limit } = req.query;
      console.log(`Fetching ${limit} messages for room:${roomId}`);
      Message.getHistory(roomId, null, null, limit)
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
      const { accountId, roomId } = params;
      const socketKey = `${accountId}:${roomId}`;

      console.log(`'${req.user.id}' is joining '${socketKey}'`);
      req.socket.join(socketKey);
      req.socket.broadcast.to(socketKey).emit("users:join", {
        user: req.user.toJSON(),
        accountId,
        roomId
      });
    },

    leave(req) {
      const params = req.isSocket ? req.data : req.params;
      const { accountId, roomId } = params;
      const socketKey = `${accountId}:${roomId}`;

      console.log(`'${req.user.id}' is leaving '${socketKey}'`);
      req.socket.leave(socketKey);
      req.socket.broadcast.to(socketKey).emit("users:leave", {
        user: req.user.toJSON(),
        accountId,
        roomId
      });
    },

    typing(req, res) {
      const { roomId } = req.params;
      const { accountId } = req.body;
      const { user } = req;
      const socketKey = `${accountId}:${roomId}`;
      app.io.in(socketKey).emit("users:typing", {
        roomId,
        userId: user.id
      });
      if (!req.isSocket) {
        res.status(204).send();
      }
    }
  });
};
