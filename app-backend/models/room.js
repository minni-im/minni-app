import recorder from "tape-recorder";

let RoomSchema = new recorder.Schema({
  name: String,
  topic: String,
  token: String
});

export default recorder.model("Room", RoomSchema);
