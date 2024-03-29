import recorder from "@minni-im/tape-recorder";

import { TYPE } from "../models/room";

import { requireLogin } from "../middlewares/auth";
import { requireValidAccount } from "../middlewares/account";
import { requireValidRoom, requireRoomAdmin } from "../middlewares/room";

export default (app) => {
  const cache = app.get("cache");

  app.get(
    "/api/accounts/:accountId/rooms",
    requireLogin,
    requireValidAccount,
    (req) => {
      req.io.route("rooms:list");
    }
  );

  app.put(
    "/api/accounts/:accountId/rooms/",
    requireLogin,
    requireValidAccount,
    (req) => {
      req.io.route("rooms:create");
    }
  );

  app.delete(
    "/api/rooms/:roomId",
    requireLogin,
    requireValidRoom,
    requireRoomAdmin,
    (req) => {
      req.io.route("rooms:delete");
    }
  );

  app.post(
    "/api/rooms/:roomId",
    requireLogin,
    requireValidRoom,
    requireRoomAdmin,
    (req) => {
      req.io.route("rooms:update");
    }
  );

  app.post("/api/rooms/:roomId/star", requireLogin, requireValidRoom, (req) => {
    req.io.route("rooms:star");
  });

  app.post(
    "/api/rooms/:roomId/unstar",
    requireLogin,
    requireValidRoom,
    (req) => {
      req.io.route("rooms:unstar");
    }
  );

  app.get(
    "/api/rooms/:roomId/messages",
    requireLogin,
    requireValidRoom,
    (req) => {
      req.io.route("rooms:messages");
    }
  );

  app.post(
    "/api/rooms/:roomId/typing",
    requireLogin,
    requireValidRoom,
    (req) => {
      req.io.route("rooms:typing");
    }
  );

  app.io.route("rooms", {
    star(req, res) {
      const { room, user } = req;
      const { settings } = user;
      if (!settings.starred) {
        settings.starred = { rooms: [] };
      }
      const { rooms } = user.settings.starred;

      if (rooms.indexOf(room.id) === -1) {
        rooms.push(room.id);
      }

      user.save().then(
        () => {
          res.json({
            ok: true,
            message: `Room '${room.name}' has been starred`,
          });
        },
        (error) => {
          res.json({
            ok: false,
            message:
              "We did not managed to star the room. Please try again later.",
            errors: error,
          });
        }
      );
    },

    unstar(req, res) {
      const { room, user } = req;
      let { rooms } = user.settings.starred;
      if (!rooms || (rooms && rooms.indexOf(room.id) === -1)) {
        res.json({
          ok: true,
          message: "Nothing to be done.",
        });
        return;
      }

      rooms = rooms.splice(rooms.indexOf(room.id), 1);

      user.save().then(
        () => {
          res.json({
            ok: true,
            message: `Room '${room.name}' has been unstarred`,
          });
        },
        (error) => {
          res.json({
            ok: false,
            message:
              "We did not managed to unstar the room. Please try again later.",
            errors: error,
          });
        }
      );
    },

    list(req, res) {
      const Room = recorder.model("Room");
      const { accountId } = req.params;
      const { user } = req;
      Room.getListForAccountAndUser(accountId, user)
        .then(
          (rooms) =>
            rooms.map(
              (room) =>
                new Promise((resolve, reject) => {
                  const cacheKey = `${room.accountId}:${room.id}`;
                  cache.hgetall(cacheKey, (err, state) => {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(Object.assign(room, state));
                  });
                })
            ),
          (error) => {
            res.json({
              ok: false,
              errors: error,
            });
          }
        )
        .then((rooms) => Promise.all(rooms))
        .then((rooms) =>
          res.json({
            ok: true,
            rooms,
          })
        );
    },

    create(req, res) {
      const Room = recorder.model("Room");
      const { name, topic, type, usersId } = req.body;
      const accountId = req.params.accountId;
      const { user, account } = req;

      if (!account.userBelongTo(user.id)) {
        res.status(401).json({
          ok: false,
          message: "You are not allowed to create a room in this account.",
        });
        return;
      }

      Room.isValidName(accountId, name).then((valid) => {
        if (!valid) {
          res.status(400).json({
            ok: false,
            message: `A room with name: '${name}' already exist in account: '${account.name}'`,
          });
          return;
        }

        const room = new Room({
          name,
          topic,
          type,
          accountId,
          usersId,
          adminId: user.id,
        });

        room.save().then(
          (newRoom) => {
            // TODO: Security fix, we should only send to concerned people
            app.io.in(accountId).emit("room:create", {
              room: room.toAPI(),
            });
            res.status(201).json({
              ok: true,
              message: `Room '${name}' has been successfully created`,
              room: newRoom.toAPI(true),
            });
          },
          (error) => {
            res.json({
              ok: false,
              message: "Creation of new room failed.",
              errors: error,
            });
          }
        );
      });
    },

    update(req, res) {
      const { name, topic, type, usersId } = req.body;
      const { room } = req;
      if (name && room.type !== TYPE.INITIAL) {
        room.name = name;
      }
      if (topic) {
        room.topic = topic;
      }
      if (type && type !== room.type) {
        room.type = type;
        room.usersId = usersId || room.usersId;
      }
      Promise.all([
        room.save(),
        new Promise((resolve) => {
          cache.hgetall(`${room.accountId}:${room.id}`, (error, meta) => {
            if (error) {
              console.error(error);
              resolve({});
              return;
            }
            resolve(meta);
          });
        }),
      ]).then(
        ([updatedRoom, meta]) => {
          res.json({
            ok: true,
            room: Object.assign(updatedRoom.toAPI(true), meta),
          });
          app.io.in(room.accountId).emit("room:update", {
            room: Object.assign(updatedRoom.toAPI(), meta),
          });
        },
        ({ message }) => {
          res.json({
            ok: false,
            message: "Room update failed.",
            errors: message,
          });
        }
      );
    },

    delete(req, res) {
      const { room } = req;
      room.remove().then(
        () => {
          res.json({ ok: true, room: room.toAPI(true) });
          app.io.in(room.accountId).emit("room:delete", {
            room: room.toAPI(),
          });
          cache.del(`${room.accountId}:${room.id}`);
        },
        ({ message, error, reason }) => {
          if (error === "" && reason) {
            res.json({ ok: false, message: reason });
            return;
          }
          res.json({
            ok: false,
            message: "Room deletion failed.",
            errors: message,
          });
        }
      );
    },

    messages(req, res) {
      const Message = recorder.model("Message");
      const { roomId } = req.params;
      const { limit, latest, oldest } = req.query;
      // console.log(`Fetching ${limit} messages for room:${roomId}`);
      Message.getHistory(roomId, latest, oldest, limit).then(
        (messages) => {
          res.json({
            ok: true,
            messages: messages.map((message) => message.toAPI()),
          });
        },
        (error) => {
          res.json({
            ok: false,
            message: `Fetching messages for room:${roomId} failed`,
            errors: error,
          });
        }
      );
    },

    join(req) {
      const params = req.isSocket ? req.data : req.params;
      const { accountId, roomId } = params;
      const socketKey = `${accountId}:${roomId}`;

      // console.log(`'${req.user.id}' is joining '${socketKey}'`);
      req.socket.join(socketKey);
      req.socket.broadcast.to(socketKey).emit("users:join", {
        user: req.user.toAPI(),
        accountId,
        roomId,
      });
    },

    leave(req) {
      const params = req.isSocket ? req.data : req.params;
      const { accountId, roomId } = params;
      const socketKey = `${accountId}:${roomId}`;

      // console.log(`'${req.user.id}' is leaving '${socketKey}'`);
      req.socket.leave(socketKey);
      req.socket.broadcast.to(socketKey).emit("users:leave", {
        user: req.user.toAPI(),
        accountId,
        roomId,
      });
    },

    typing(req, res) {
      const { roomId } = req.params;
      const { accountId } = req.body;
      const { user } = req;
      const socketKey = `${accountId}:${roomId}`;
      app.io.in(socketKey).emit("users:typing", {
        roomId,
        userId: user.id,
      });
      if (!req.isSocket) {
        res.status(204).send();
      }
    },
  });
};
