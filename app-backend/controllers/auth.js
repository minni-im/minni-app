import bcrypt from "bcryptjs";
import recorder from "tape-recorder";

import {
    providers,
    initialize,
    authenticate,
    connect,
    disconnect } from "../auth";
import {
  requireUsernamePassword,
  requireLoginRedirect } from "../middlewares/auth";
import {
  requireEmailRedirect,
  requireProfileInfoRedirect } from "../middlewares/profile";


const oauthProvidersInfo =
  Object.keys(providers)
    .filter(p => (p !== "local"))
    .map((name) => {
      const { logo } = providers[name];
      return { name, logo };
    });


export default (app) => {
  /* =Parameters= */
  app.param("provider", (req, res, next, provider) => {
    if (provider in providers) {
      next();
    } else {
      res.status(400).json({
        status: "error",
        message: `'${provider}' is not a supported provider`
      });
    }
  });

  // =Middelwares= */
  app.use(requireEmailRedirect);

  /* =Routes= */
  app.get([
    "/login",
    "/signup",
  ], (req, res) => {
    res.render("chat", {
      providers: oauthProvidersInfo,
      splashscreen: false
    });
  });

  app.route("/login/reset-password")
    .post((req) => {
      req.io.route("auth:resetpassword");
    });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });


  const signupViewOptions = {
    title: "Sign Up",
    providers: oauthProvidersInfo,
    fields: {}
  };

  app.route("/signup")
    .post((req, res) => {
      const { username, email, password } = req.body;
      const errors = [];

      if (!username) { errors.push("Username"); }
      if (!email) { errors.push("Email address"); }
      if (!password) { errors.push("Password"); }

      const newSignupViewOptions = Object.assign({}, signupViewOptions, { fields: req.body });

      if (errors.length > 0) {
        res.flash("error", `${errors.join(", ")} ${errors.length > 0 ? "are" : "is"} mandatory`);
        res.render("signup", newSignupViewOptions);
        return;
      }

      bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
          res.flash("error", error);
          res.render("signup", newSignupViewOptions);
        }

        const User = recorder.model("User");
        const user = new User({
          nickname: username,
          email,
          password: hash
        });

        user.save()
          .then(() => {
            req.flash("info", "Your account has been created. Please try to logging in now!");
            res.redirect(providers.local.successRedirect);
          }, (err) => {
            console.error(err);
            res.flash("error", "Sorry, we could not process your request");
            res.render("signup", newSignupViewOptions);
          });
      });
    });

  // Registering auth providers routes and middlewares
  for (const provider in providers) {
    if (providers.hasOwnProperty(provider) && provider !== "local") {
      app.get(`/login/${provider}`, initialize(provider));
      app.get(`/signup/${provider}`, authenticate(provider));
      app.get(`/auth/${provider}/callback`, authenticate(provider));
      app.get(`/connect/${provider}`, requireLoginRedirect, connect(provider));
      app.get(`/connect/${provider}/revoke`, requireLoginRedirect, disconnect(provider));
    }
  }

  /* =API routes= */
  app.post("/api/auth/login",
    requireUsernamePassword,
    authenticate("local"),
    (req, res, next) => {
      console.log("authent ok");
      res.json({
        ok: true,
        token: req.user.token
      });
    },
    (err, req, res, next) => {
      console.error(err.message);
      res.status(401).json({
        ok: false,
        error: err.name,
        message: `Username/password for '${req.body.username}' is incorrect`
      });
    }
  );

  app.post("/api/auth/register", (req, res) => {

  });

  /* =Socket routes= */
  app.io.route("auth", {
    resetpassword(req, res) {
      // TODO to be implemented
    }
  });
};
