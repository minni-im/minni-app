import { requireLogin } from "../middlewares/auth";
import auth from "../auth";


export default (app) => {

  app.route("/profile")
    .all(requireLogin)
    .get((req, res) => {
      res.render("profile", {
        title: "Your profile",
        providers: auth.providers
      });
    })
    .post((req) => {
      req.io.route("me:profile");
    });

  app.get("/api/me", requireLogin, function(req) {
    req.io.route("me:whoami");
  });

  app.get("/api/me/token/generate", requireLogin, function(req) {
    req.io.route("me:generateToken");
  });

  app.get("/api/me/token/revoke", requireLogin, function(req) {
    req.io.route("me:revokeToken");
  });


  /* =Socket routes= */

  app.io.route("me", {
    whoami(req, res) {
      res.json(req.user.toAPI(true));
    },

    generateToken(req, res) {
      let user = req.user;
      if (user.usingToken) {
        return res.status(403).json({
          ok: false,
          message: "Cannot generate a new token when using token authentication."
        });
      }
      user.generateToken().then((token) => {
        res.json({
          ok: true,
          message: "Token generated.",
          token: token
        });
      }, () => {
        res.json({
          ok: false,
          message: "Unable to generate a token."
        });
      });
    },

    revokeToken(req, res) {
      let user = req.user;
      if (user.usingToken) {
        return res.status(403).json({
          ok: false,
          message: "Cannot revoke token when using token authentication."
        });
      }
      delete user.token;
      user.save().then(() => {
        res.json({
          ok: true,
          message: "Token revoked."
        });
      }, (error) => {
        return res.status(500).json({
          ok: false,
          message: "Oops, it did not work. Please ty again.",
          errors: error
        });
      });
    },

    profile(req, res) {
      let user = req.user;
      let { firstname, lastname, nickname, email, gravatarEmail } = req.body;
      if (firstname) { user.firstname = firstname; }
      if (lastname) { user.lastname = lastname; }
      if (nickname) { user.nickname = nickname; }
      if (email) { user.email = email; }
      if (gravatarEmail) { user.gravatarEmail = gravatarEmail; }

      user.save().then(() => {
        if (!req.isSocket) {
          res.redirect("/profile");
        }
        res.status(200).json({ ok: true });
      }, (error) => {
        let errorMessage = "Oh noes! Something went wrong! Apparently, that didn't work. Please try again.";
        if (!req.isSocket) {
          console.error(error);
          req.flash("error", errorMessage);
          res.redirect("profile");
          return;
        }
        res.status(500).json({ ok: false, message: errorMessage, errors: error });
      });
    }
  });
};
