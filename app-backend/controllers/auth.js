import auth from "../auth";

export default (app) => {

  app.get("/", (Req, res) => {
    res.send("Hello minni-app");
  });

  app.get("/login", (req, res) => {
    res.render("login", {
      auth: auth.providers
    });
  });

  app.get("/logout", function(req, res ) {
    req.session.destroy();
    res.redirect("/");
  });

  app.get("/login/:provider", (req) => {
    req.io.route("auth:login");
  });

  app.post("/signup/:provider", (req) => {
    req.io.route("auth:signup");
  });

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

  app.io.route("auth", {
    signup(req, res) {
      let provider = req.params.provider;
      auth.signup(provider, req, res)
        .then(user => {

        })
        .catch(error => {

        });
    },

    login(req, res) {
      let provider = req.params.provider;
      auth.authenticate(provider, req, res)
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
        })
        .catch(errorCode => {
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
