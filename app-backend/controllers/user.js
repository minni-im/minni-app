import { requireLogin } from "../middlewares/auth";


export default (app) => {

  app.get("/me", requireLogin, function(req) {
    req.io.route("me:whoami");
  })

  app.get("/me/token/generate", requireLogin, function(req) {
    req.io.route("me:generateToken");
  });

  app.get("/me/token/revoke", requireLogin, function(req) {
    req.io.route("me:revokeToken");
  });


  /* =Socket routes= */
  app.io.route("me", {
    whoami(req, res) {
      res.json(req.user);
    },

    generateToken(req, res) {

    },

    revokeToken(req, res) {

    }
  });
};
