import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import recorder from "tape-recorder";

export default class LocalAuth {
  constructor(options = {}) {
    this.options = Object.assign({
      failureRedirect: "/login",
      successRedirect: "/"
    }, options);
  }

  setup() {
    passport.use(new LocalStrategy({
      usernameField: "username",
      passwordField: "password"
    }, function localAuthVerify(identifier, password, done) {
      let User = recorder.model("User");
      User.authenticate(identifier, password)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false, {
            message: `Username/password for '${identifier}' is incorrect`
          });
        }, (error) => {
          console.error("Passport LocalStrategy error", error);
          done(null, false, {
            message: `Username/password for '${identifier}' is incorrect`
          });
        });
    }));
  }

  authenticate() {
    return passport.authenticate("local", {
      successRedirect: this.options.successRedirect,
      failureRedirect: this.options.failureRedirect,
      failureFlash: true
    });
  }
}
