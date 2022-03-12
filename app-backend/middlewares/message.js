import recorder from "@minni-im/tape-recorder";

export function requireValidMessage(req, res, next) {
  const Message = recorder.model("Message");
  Message.findById(req.params.messageId).then(
    (message) => {
      if (message) {
        req.message = message;
        next();
      }
    },
    (error) => {
      next(error);
    }
  );
}

export function requireValidMessageAuthor(req, res, next) {
  const { user, message } = req;
  if (message.userId === user.id) {
    next();
    return;
  }
  next(new Error("You don't have the permission to execute this action"));
}
