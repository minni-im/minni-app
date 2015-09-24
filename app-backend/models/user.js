import bcrypt from "bcryptjs";
import recorder from "tape-recorder";
import crypto from "crypto";

let UserSchema = new recorder.Schema({
  firstname: String,
  lastname: String,
  nickname: String,
  password: String,
  email: String,
  gravatarEmail: String,
  picture: String,
  token: String,
  providers: {
    type: Object,
    default: {}
  }
});

UserSchema.virtual({
  initials: {
    get() {
      if (this.firstname && this.lastname) {
        return this.firstname[0].toUpperCase() + this.lastname[0].toUpperCase();
      }
    }
  },
  fullname: {
    get() {
      if (this.firstname && this.lastname) {
        return `${this.firstname} ${this.lastname}`;
      }
      return this.nickname;
    },
    set(value) {
      if (value.indexOf(" ") !== -1) {
        [this.firstname, this.lastname] = value.split(" ");
      }
    }
  }
});

UserSchema
  .method("avatar", function avatar(size = 80) {
    if (this.picture) {
      return `${this.picture}&s=${size}`;
    }
    let hash = crypto.createHash("md5").update(this.email).digest("hex");
    if (this.gravatarEmail) {
      hash = crypto.createHash("md5").update(this.gravatarEmail).digest("hex");
    }
    return `https://secure.gravatar.com/avatar/${hash}?s=${size}`;
  })
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
          return reject(error);
        }
        if (!isMatch) {
          resolve(false);
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
  .static("findByToken", function findByToken(token) {
    return this.where("token", { key: token })
      .then(users => {
        return users[0];
      });
  })
  .static("authenticate", function authenticate(identifier, password) {
    return this.where("email", { key: identifier })
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
