import auth from "../auth";

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

  /* =Routes= */
  app.get("/", (req, res) => {
    res.render("home");
  });

  app.get("/login", (req, res) => {
    res.render("login", {
      providers: Object.keys(auth.providers)
    });
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.post("/login", function(req, res) {
    auth.authenticate("local", req, res, function(error, user, info) {
      if (!user) {
        if (info && info.message) {
          req.flash("error", info.message);
        }
        res.redirect("/login");
      }
      req.login(user, function(loginError) {
        if (loginError) {
          console.error("Login user via 'local' auth error", loginError);
        }
        res.redirect("/");
      });
    });
  });

  app.get([
    "/login/:provider",
    "/signup/:provider",
    "/auth/:provider/callback"
  ], function(req, res) {
    let provider = req.params.provider;
    auth.authenticate(provider, req, res, function(error, user, info) {
      if (!user) {
        if (info && info.message) {
          req.flash("error", info.message);
        }
        res.redirect("/login");
      }
      req.login(user, function(loginError) {
        if (loginError) {
          console.error(`Login user via ${provider} auth error`, loginError);
        }
        res.redirect("/");
      });
    });
  });

  // app.get("/connect/:provider", (req, res, next) => {
  //   return auth.connect(req.params.provider)(req, res, next);
  // });

  /* =Socket routes= */
  app.io.route("auth", {
    login(req, res) {
      let provider = req.params.provider;
      auth.authenticate(provider, req)
        .then(user => {
          req.login(user, (error) => {
            if (error) {
              return res.status(400).json({
                status: "error",
                message: "There were problems logging you in.",
                errors: error
              });
            }
            res.redirect("/");
          });
        }, errorCode => {
          let errorInfo = {
            status: "error"
          };
          switch (errorCode) {
            case 400:
               errorInfo.message = "There were problems logging you in.";
              break;
            case 401:
              errorInfo.message = "Incorrect login credentials.";

          }
          return res.status(errorCode).json(errorInfo);
        });
    }
  });

};
