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
    }, (identifier, password, done) => {
      const User = recorder.model("User");
      User.authenticate(identifier, password)
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }
          done(null, false, {
            message: `Username/password for '${identifier}' is incorrect`
          });
        }, (error) => {
          console.error("Passport LocalStrategy error", error);
          done(error);
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
