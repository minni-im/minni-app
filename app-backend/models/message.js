import recorder from "tape-recorder";

let MessageSchema = new recorder.Schema({
  content: String,
  roomId: String,
  userId: String
});

export default recorder.model("Message", MessageSchema);
