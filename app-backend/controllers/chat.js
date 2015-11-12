import recorder from "tape-recorder";

export default (app) => {

  app.io.on("connection", (socket) => {
    const { user } = socket.request;
    console.log(`'${user.id}' is connecting`);
    app.io.emit("users:connect", { user: user.toJSON() });
  });

  app.io.route("disconnect", (req) => {
    const { user } = req;
    console.log(`'${user.id}' is disconnected`);
    app.io.emit("users:disconnect", { user: user.toJSON() });
  });

};
