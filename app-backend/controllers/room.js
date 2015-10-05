import recorder from "tape-recorder";

import { requireLogin } from "../middlewares/auth";

export default (app) => {
  app.get("/api/accounts/:id/rooms/", requireLogin, (req) => {
    req.io.route("rooms:list");
  });



  app.io.route("rooms", {
    list(req, res) {
      const Room = recorder.model("Room");
      Room.where("accountId", { key: req.params.id })
        .then(rooms => {
          res.json({
            ok: true,
            rooms: rooms.map(room => {
              return room.toAPI(req.user.id === room.adminId);
            })
          });
        });
    }
  });
};
