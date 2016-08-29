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

export function requireRoomAdmin(req, res, next) {
  const { user, room } = req;
  if (room.isAdmin(user)) {
    next();
    return;
  }
  next(new Error("You don't have the permission to execute this action"));
}
