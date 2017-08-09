import recorder from "tape-recorder";

export default (app) => {
  const cache = app.get("cache");

  app.io.route("connect-me", (req) => {
    const Account = recorder.model("Account");
    const User = recorder.model("User");
    const Room = recorder.model("Room");

    const { socket, user } = req;
    const { connectedRooms } = req.data;

    Account.getListForUser(user.id).then((accounts) => {
      const size = accounts.length;

      accounts = accounts.map((account) => {
        socket.join(account.id);
        // console.log(`'${user.id}' has joined '${account.id}'`);
        app.io.emit("users:connect", { user: user.toAPI() });
        return account.toAPI(user.id === account.adminId);
      });

      const rooms = accounts.map((account) => {
        const { id: accountId } = account;
        if (connectedRooms[accountId]) {
          connectedRooms[accountId].forEach((roomId) => {
            const socketKey = `${accountId}:${roomId}`;
            socket.join(socketKey);
            socket.broadcast.to(socketKey).emit("users:join", {
              user: user.toAPI(),
              accountId,
              roomId,
            });
            // console.log(`'${user.id}' has joined '${socketKey}'`);
          });
        }
        return Room.where("accountId", { key: account.id }).then(
          room =>
            new Promise((resolve, reject) => {
              const cacheKey = `${account.id}:${room.id}`;
              cache.hgetall(cacheKey, (err, state) => {
                if (err) {
                  return reject(err);
                }
                return resolve(Object.assign(room, state));
              });
            })
        );
      });

      const usersId = accounts.reduce((ids, account) => {
        account.usersId.forEach((id) => {
          ids.add(id);
        });
        return ids;
      }, new Set());
      const users = Array.from(usersId).map(userId => User.findById(userId));

      const presence = new Set();

      Promise.all([...rooms, ...users])
        .then((results) => {
          const finalRooms = results
            .slice(0, size)
            .reduce((flat, flatRooms) => flat.concat(flatRooms), [])
            .filter(room => room.isAccessGranted(user.id))
            .map(room => room.toAPI(user.id === room.adminId));
          const finalUsers = results.slice(size).map(finalUser => finalUser.toAPI());

          for (const clientSocket of Object.keys(app.io.sockets.adapter.nsp.connected)) {
            const client = app.io.sockets.adapter.nsp.connected[clientSocket];
            if (client.request.user.id !== user.id) {
              presence.add({
                userId: client.request.user.id,
                status: client.status,
              });
            }
          }

          socket.emit("connected", {
            user: user.toAPI(true),
            accounts,
            rooms: finalRooms,
            users: finalUsers,
            presence: Array.from(presence),
          });
        })
        .catch((ex) => {
          console.log(`Socket connection failed [sid: ${socket.id}, id:${user.id}]`);
          console.error(ex);
        });
    });
  });

  app.io.route("disconnecting", (req) => {
    const { socket, user } = req;
    // console.log(`'${user.id}' is about to be disconnected`);
    // Notifying all rooms the user was connected to
    for (const socketRoomName of Object.keys(socket.rooms)) {
      if (socketRoomName.includes(":")) {
        const [accountId, roomId] = socketRoomName.split(":");
        socket.broadcast.to(socketRoomName).emit("users:leave", {
          user: user.toAPI(false),
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
