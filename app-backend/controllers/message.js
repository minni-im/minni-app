import recorder from "tape-recorder";
import { requireLogin } from "../middlewares/auth";

import embed from "../libs/embeds";

export default (app) => {
  const cache = app.get("cache");

  app.put("/api/messages/", requireLogin, (req) => {
    req.io.route("messages:create");
  });

  app.io.route("messages", {
    create(req, res) {
      const Message = recorder.model("Message");
      const nonce = req.body.nonce;
      const { content, accountId, roomId, userId, embeds, type, subType } = req.body;
      const message = new Message({ content, userId, roomId, embeds, type, subType });

      message.save().then(
        (newMessage) => {
          const json = newMessage.toAPI();
          const socketKey = `${accountId}:${message.roomId}`;

          res.status(201).json({
            ok: true,
            message: nonce ? Object.assign(json, { nonce }) : json,
          });
          app.io.in(socketKey).emit("messages:create", json);

          cache.hmset(socketKey, {
            lastMsgTimestamp: json.lastUpdated.toISOString(),
            lastMsgUserId: userId,
          });

          embed(json.content).then(
            (detectedEmbeds) => {
              if (detectedEmbeds.length > 0) {
                newMessage.embeds = detectedEmbeds;
                newMessage.save().then((embeddedMessage) => {
                  const embeddedMessageJson = embeddedMessage.toAPI();
                  cache.hmset(
                    socketKey,
                    "lastMsgTimestamp",
                    embeddedMessageJson.lastUpdated.toISOString()
                  );
                  app.io.in(socketKey).emit("messages:update", embeddedMessageJson);
                });
              }
            },
            (error) => {
              app.io.in(socketKey).emit("messages:update-failed", {
                id: json.id,
                roomId,
                messages: [error],
              });
            }
          );
        },
        (error) => {
          res.json({
            ok: false,
            body: req.body,
            message: "Message creation failed",
            errors: error,
          });
        }
      );
    },
  });
};
