import recorder from "tape-recorder";

let UserSchema = new recorder.Schema({
  firstname: String,
  lastname: String,
  nickname: String,
  email: String,
  gravatarEmail: String,
  token: String,
  providers: {
    type: Object,
    default: {}
  }
});

UserSchema.virtual({
  fullname: {
    get() {
      return `${this.firstname} ${this.lastname}`;
    },
    set(value) {
      [this.firstname, this.lastname] = value.split(" ");
    }
  }
});

UserSchema.static("findByToken", function findByToken(token) {
  return this.where("token", token).then(users => {
    return users[0];
  });
});

UserSchema
  .view("byProviderId", {
    map: `function(doc) {
      if (doc.modelType === "User" && doc.providers) {
        for (var provider in doc.providers) {
          emit([provider, doc.providers[provider]], doc);
        }
      }
    }`
  })
  .static("findByProviderId", function findByProviderId(provider, id) {
    return this.where("byProviderId", { key: [provider, id] })
      .then((users) => {
        return users[0];
      });
});

export default recorder.model("User", UserSchema);
