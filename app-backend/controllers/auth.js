import bcrypt from "bcryptjs";
import recorder from "tape-recorder";

import auth from "../auth";
import { requireLoginRedirect } from "../middlewares/auth";
import { requireEmailRedirect, requireProfileInfoRedirect } from "../middlewares/profile";


let oauthProvidersInfo =
  Object.keys(auth.providers)
    .filter((p) => (p !== "local"))
    .map((name) => {
      let { logo } = auth.providers[name];
      return { name, logo };
    });


export default (app) => {

  /* =Parameters= */
  app.param("provider", (req, res, next, provider) => {
    if (provider in auth.providers) {
      next();
    } else {
      return res.status(400).json({
        status: "error",
        message: `'${provider}' is not a supported provider`
      });
    }
  });

  // =Middelwares= */
  app.use(requireEmailRedirect);

  /* =Routes= */
  app.get("/", requireLoginRedirect, requireProfileInfoRedirect, (req, res) => {
    res.render("chat");
  });

  app.route("/login")
    .get((req, res) => {
      res.render("login", {
        title: "Signin",
        providers: oauthProvidersInfo
      });
    })
    .post(auth.authenticate("local"));

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });


  let signupViewOptions = {
    title: "Sign Up",
    providers: oauthProvidersInfo,
    fields: {}
  };

  app.route("/signup")
    .get((req, res) => {
      res.render("signup", signupViewOptions);
    })
    .post((req, res) => {
      let { username, email, password } = req.body;
      let errors = [];

      if (!username) { errors.push("Username"); }
      if (!email) { errors.push("Email address"); }
      if (!password) { errors.push("Password"); }

      let newSignupViewOptions = Object.assign({}, signupViewOptions, { fields: req.body });

      if (errors.length > 0) {
        res.flash("error", `${errors.join(", ")} ${errors.length > 0 ? "are" : "is"} mandatory`);
        return res.render("signup", newSignupViewOptions);
      }

      bcrypt.hash(password, 10, function(error, hash) {
        if (error) {
          res.flash("error", error);
          return res.render("signup", newSignupViewOptions);
        }

        let User = recorder.model("User");
        let user = new User({
          nickname: username,
          email: email,
          password: hash
        });

        user.save()
          .then(function() {
            req.flash("info", "Your account has been created. Please try to logging in now!");
            res.redirect(auth.providers.local.successRedirect);
          }, function(err) {
            console.error(err);
            res.flash("error", "Sorry, we could not process your request");
            res.render("signup", newSignupViewOptions);
          });
      });
    });

  // Registering auth providers routes and middlewares
  for (let provider in auth.providers) {
    if (provider !== "local") {
      app.get(`/login/${provider}`, auth.initialize(provider));
      app.get(`/signup/${provider}`, auth.authenticate(provider));
      app.get(`/auth/${provider}/callback`, auth.authenticate(provider));
      app.get(`/connect/${provider}`, requireLoginRedirect, auth.connect(provider));
    }
  }

  /* =Socket routes= */
  app.io.route("auth", {

  });

};
