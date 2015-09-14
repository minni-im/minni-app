import bcrypt from "bcryptjs";
import recorder from "tape-recorder";

let UserSchema = new recorder.Schema({
  firstname: String,
  lastname: String,
  nickname: String,
  password: String,
  email: String,
  gravatarEmail: String,
  avatar: String,
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
      if (value.indexOf(" ") !== -1) {
        [this.firstname, this.lastname] = value.split(" ");
      }
    }
  }
});

UserSchema
  .method("toJSON", function toJSON() {
    return {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      nickname: this.nickname,
      avatar: this.avatar,
      email: this.email
    };
  })
  .method("authenticate", function authenticate(password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        }
        if (!isMatch) {
          reject(false);
        } else {
          resolve(this);
        }
      });
    });
  })
  .method("linkProvider", function linkProvider(provider, token, profile) {
    this.providers[provider] = profile._json.id;
    return this.save();
  });

UserSchema
  .static("findById", function findById(id) {
    //TODO Should be change in recorder directly to expose byId retrieval
    return this.where("id", id)
      .then(users => {
        return users[0];
      });
  })
  .static("findByToken", function findByToken(token) {
    return this.where("token", token)
      .then(users => {
        return users[0];
      });
  })
  .static("authenticate", function authenticate(identifier, password) {
    return this.where("email", identifier)
      .then(users => {
        if (users.length) {
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
