import recorder from "tape-recorder";
import { requireLogin, requireLoginRedirect } from "../middlewares/auth";

export default (app) => {
  app.put("/api/messages/", requireLogin, (req) => {
    req.io.route("messages:create");
  });

  app.io.route("messages", {
    create(req, res) {
      const Message = recorder.model("Message");
      const nonce = req.body.nonce;
      const { accountId } = req.body;
      let message = new Message({
        content: req.body.content,
        userId: req.body.userId,
        roomId: req.body.roomId
      });

      message.save().then(newMessage => {
        let json = newMessage.toAPI();
        const socketKey = `${accountId}:${message.roomId}`;
        res.status(201).json({
          ok: true,
          message: nonce ? Object.assign(json, {nonce}) : json
        });
        app.io.in(socketKey).emit("messages:create", json);
        //TODO should trigger here embeds + pipeline execution, and push results back to sockets for client update
      }, error => {
        res.json({
          ok: false,
          message: `Message creation failed`,
          errors: error
        });
      });
    }
  });
};
