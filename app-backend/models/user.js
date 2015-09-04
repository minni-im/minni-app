import recorder from "tape-recorder";

let UserSchema = new recorder.Schema({
  firstname: String,
  lastname: String,
  nickname: String,
  password: String,
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

UserSchema.method("authenticate", function authenticate(password) {
  return new Promise((resolve, reject) => {
    return this.password === password ? resolve(this) : reject("BAD PASSWORD");
  });
});

UserSchema
  .static("findByToken", function findByToken(token) {
    return this.where("token", token)
      .then(users => {
        return users[0];
      });
  })
  .static("authenticate", function authenticate(identifier, password) {
    console.log("User.authenticate", identifier, password);
    return this.where("email", identifier)
      .then(users => {
        console.log("We got some users", users);
        if (users.length) {
          console.log("Trying to authenticate");
          return users[0].authenticate(password);
        }
        return false;
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
