import bcrypt from "bcryptjs";
import recorder from "tape-recorder";
import crypto from "crypto";

const UserSchema = new recorder.Schema({
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
  },
  settings: {
    type: Object,
    default: {}
  }
});

UserSchema.virtual({
  initials: {
    get() {
      if (this.firstname && this.lastname) {
        return [this.firstname, this.lastname]
          .map(text => text[0])
          .map(letter => letter.toUpperCase())
          .join("");
      }
      return this.nickname[0].toUpperCase();
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
  .method("toAPI", function toAPI(currentUser = false) {
    const json = {
      id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
      nickname: this.nickname,
      fullname: this.fullname,
      picture: this.avatar(160),
      email: this.email,
      gravatarEmail: this.gravatarEmail,
      providers: this.providers
    };

    if (currentUser) {
      json.settings = this.settings;
    }
    return json;
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
          resolve(false);
        } else {
          resolve(this);
        }
      });
    });
  })
  .method("linkProvider", function linkProvider(provider, token, profile) {
    this.providers[provider] = profile._json.id; // eslint-disable-line no-underscore-dangle
    return this.save();
  })
  .method("generateToken", function generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(24, (errorRandom, buffer) => {
        const password = buffer.toString("hex");

        bcrypt.hash(password, 10, (errorHash, hash) => {
          if (errorHash) {
            reject(errorHash);
            return;
          }
          this.token = hash;
          const userToken = new Buffer(`${this.id}:${password}`).toString("base64");

          this.save().then(() => {
            resolve(userToken);
          }, (error) => {
            reject(error);
          });
        });
      });
    });
  });

UserSchema
  .static("findByToken", function findByToken(token) {
    const [userId, hash] = new Buffer(token, "base64").toString("ascii").split(":");

    return this.findById(userId).then(
      user => new Promise((resolve, reject) => {
        bcrypt.compare(hash, user.token, (errorHash, isMatch) => {
          if (errorHash) {
            reject(errorHash);
            return;
          }
          resolve(isMatch ? user : false);
        });
      })
    );
  })
  .static("authenticate", function authenticate(identifier, password) {
    return this.where("email", { key: identifier }).then((users) => {
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
    return this.where("byProviderId", { key: [provider, id] }).then(users => users[0]);
  });

export default recorder.model("User", UserSchema);
