import recorder from "tape-recorder";
import { requireLogin, requireLoginRedirect } from "../middlewares/auth";

import { process as embedProcess } from "../libs/embeds";

export default (app) => {
  app.put("/api/messages/", requireLogin, (req) => {
    req.io.route("messages:create");
  });

  app.io.route("messages", {
    create(req, res) {
      const Message = recorder.model("Message");
      const nonce = req.body.nonce;
      const { content, accountId, roomId, userId } = req.body;
      let message = new Message({ content, userId, roomId });

      message.save().then(newMessage => {
        let json = newMessage.toAPI();
        const socketKey = `${accountId}:${message.roomId}`;
        res.status(201).json({
          ok: true,
          message: nonce ? Object.assign(json, {nonce}) : json
        });
        app.io.in(socketKey).emit("messages:create", json);

        embedProcess(json.content).then(embeds => {
          const flatEmbeds = embeds.reduce((flat, embed) => {
            return flat.concat(embed);
          }, []);

          if (flatEmbeds.length > 0) {
            newMessage.embeds = flatEmbeds;
            newMessage.save().then(embeddedMessage => {
              app.io.in(socketKey).emit("messages:update", embeddedMessage.toAPI());
            });
          }

        }, error => {
          app.io.in(socketKey).emit("messages:update-failed", {
            id: json.id,
            roomId,
            messages: [error]
          });
        });
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
