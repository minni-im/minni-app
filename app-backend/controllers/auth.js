import auth from "../auth";


let oauthProviders = Object.keys(auth.providers).filter((p) => (p !== "local"))


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

  app.route("/login")
    .get((req, res) => {
      res.render("login", {
        title: "Login",
        providers: oauthProviders
      });
    })
    .post(auth.authenticate("local"));

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.route("/signup")
    .get((req, res) => {
      res.render("signup", {
        title: "Sign Up",
        providers: oauthProviders
      });
    })
    .post((req, res) => {
      
    })

  // Registering auth providers routes and middlewares
  for (let provider in auth.providers) {
    if (provider !== "local") {
      app.get(`/login/${provider}`, auth.initialize(provider));
      app.get(`/signup/${provider}`, auth.authenticate(provider));
      app.get(`/auth/${provider}/callback`, auth.authenticate(provider));
      app.get(`/connect/${provider}`, auth.connect(provider));
    }
  }

  /* =Socket routes= */
  app.io.route("auth", {

  });

};
