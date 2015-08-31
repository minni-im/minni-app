import recorder from "tape-recorder";

let UserSchema = new recorder.Schema({
  firstName: String,
  lastName: String,
  nickname: String,
  email: String,
  token: String
});

UserSchema.static("findByToken", (token) => {
  return UserSchema.where("token", token).then(user => {

  });
});

export default recorder.model("User", UserSchema);
