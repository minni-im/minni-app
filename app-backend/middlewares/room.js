import recorder from "tape-recorder";

export function requireValidRoom(req, res, next) {
    const Room = recorder.model("Room");
    Room.findById(req.params.roomId).then(room => {
      if (room) {
        req.room = room;
        next();
      }
    }, error => {
      next(error);
    });
}
