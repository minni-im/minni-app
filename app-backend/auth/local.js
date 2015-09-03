import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import recorder from "tape-recorder";

export default class LocalAuth {
  constructor(options = {}) {
    this.options = options;
  }

  setup() {
    passport.use(new LocalStrategy({
      usernameField: "identifier",
      passwordField: "password"
    }, function localAuthVerify(identifier, password, done) {
      let User = recorder.model("User");

      User.authenticate(identifier, password)
        .then(user => {
          console.log("Auth done, we should have a user", user.fullname);
          if (user) {
            return done(null, user);
          }
          return done(null, false, {
            message: "Incorrect login credentials"
          });
        }, (error) => {
          console.log("Trying to auth", identifier, password, "crashed", error);
          done(null, false, {
            message: "Some fields did not validate"
          });
        });
    }));
  }

  authenticate(req, res, done) {
    passport.authenticate("local", done)(req, res);
  }
}
