import recorder from "tape-recorder";

let AccountSchema = new recorder.Schema({
  name: String,
  description: String,
  inviteToken: String,
  token: String,
  users: Array
});

export default recorder.model("Account", AccountSchema);
