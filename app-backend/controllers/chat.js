import recorder from "tape-recorder";

export default (app) => {
  const cache = app.get("cache");

  app.io.route("connect-me", (req) => {
    const Account = recorder.model("Account");
    const User = recorder.model("User");
    const Room = recorder.model("Room");

    const { socket, user } = req;
    const { connectedRooms } = req.data;
    const userPublic = user.toAPI();
    const userAdmin = user.toAPI(true);

    Account.getListForUser(user.id).then((accounts) => {
      const size = accounts.length;

      accounts = accounts.map((account) => {
        const { id } = account;
        socket.join(id);
        // console.log(`'${user.id}' has joined '${account.id}'`);
        app.io.emit("users:connect", { user: userPublic });

        if (connectedRooms[id]) {
          connectedRooms[id].forEach((roomId) => {
            const socketKey = `${id}:${roomId}`;
            socket.join(socketKey);
            socket.broadcast.to(socketKey).emit("users:join", {
              user: userPublic,
              accountId: id,
              roomId,
            });
            // console.log(`'${user.id}' has joined '${socketKey}'`);
          });
        }
        return account.toAPI(user.id === account.adminId);
      });

      const rooms = accounts.map(account =>
        Room.getListForAccountAndUser(account.id, user).then(list =>
          Promise.all(
            list.map(
              room =>
                new Promise((resolve, reject) => {
                  const cacheKey = `${room.accountId}:${room.id}`;
                  cache.hgetall(cacheKey, (err, state) => {
                    if (err) {
                      return reject(err);
                    }
                    return resolve(Object.assign(room, state));
                  });
                })
            )
          )
        )
      );

      const usersId = accounts.reduce((ids, account) => {
        account.usersId.forEach((id) => {
          ids.add(id);
        });
        return ids;
      }, new Set());
      const users = Array.from(usersId).map(userId => User.findById(userId).then(u => u.toAPI()));

      const presence = new Set();
      for (const clientSocket of Object.keys(app.io.sockets.adapter.nsp.connected)) {
        const client = app.io.sockets.adapter.nsp.connected[clientSocket];
        if (client.request.user.id !== user.id) {
          presence.add({
            userId: client.request.user.id,
            status: client.status,
          });
        }
      }

      Promise.all([...rooms, ...users]).then(
        (results) => {
          const finalRooms = results.slice(0, size).reduce((flat, list) => flat.concat(list), []);
          const finalUsers = results.slice(size);

          socket.emit("connected", {
            user: userAdmin,
            accounts,
            rooms: finalRooms,
            users: finalUsers,
            presence: Array.from(presence),
          });
        },
        (error) => {
          console.log(`Socket connection failed [sid: ${socket.id}, id:${user.id}]`);
          console.error(error);
        }
      );
    });
  });

  app.io.route("disconnecting", (req) => {
    const { socket, user } = req;
    const userPublic = user.toAPI();
    // console.log(`'${user.id}' is about to be disconnected`);
    // Notifying all rooms the user was connected to
    for (const socketRoomName of Object.keys(socket.rooms)) {
      if (socketRoomName.includes(":")) {
        const [accountId, roomId] = socketRoomName.split(":");
        socket.broadcast.to(socketRoomName).emit("users:leave", {
          user: userPublic,
          accountId,
          roomId,
        });
      }
    }
  });

  app.io.route("disconnect", ({ user }) => {
    app.io.emit("users:disconnect", { user: user.toAPI() });
    // console.log(`'${user.id}' is disconnected`);
  });
};
