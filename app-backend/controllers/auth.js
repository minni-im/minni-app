import recorder from "@minni-im/tape-recorder";
import bcrypt from "bcryptjs";

import {
  providers,
  initialize,
  authenticate,
  connect,
  disconnect,
} from "../auth";
import { requireLoginRedirect } from "../middlewares/auth";
import {
  requireEmailRedirect,
  requireProfileInfoRedirect,
} from "../middlewares/profile";
import config from "../config";

const demo = config.demo;

const randomNames = [
  "ziggy.greene",
  "lily-mae.cole",
  "diego.santos",
  "cari.avalos",
  "subhan.kramer",
  "dixie.churchill",
  "saxon.dickerson",
  "neo.guy",
  "iqra.tanner",
  "chloe-ann.simmons",
  "cordelia.cisneros",
  "gabriella.vance",
  "ricky.wharton",
  "eileen.andrews",
  "cheyanne.mclaughlin",
  "rianna.pike",
  "yassin.hills",
  "shanna.floyd",
  "ralphy.henry",
  "jorge.hays",
];

function getRandomEmail() {
  const name = randomNames[Math.floor(Math.random() * randomNames.length)];
  return `${name}@minni.im`;
}

const oauthProvidersInfo = Object.keys(providers)
  .filter((p) => p !== "local")
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
        message: `'${provider}' is not a supported provider`,
      });
    }
  });

  /* =Middelwares= */
  app.use(requireEmailRedirect);

  /* =Routes= */
  app.get("/", requireLoginRedirect, requireProfileInfoRedirect, (req, res) => {
    res.render("chat");
  });

  if (!demo) {
    app
      .route("/login")
      .get((req, res) => {
        res.render("login", {
          title: "Signin",
          providers: oauthProvidersInfo,
        });
      })
      .post(authenticate("local"));
    app
      .route("/login/reset-password")
      .get((req, res) => {
        res.render("reset-password", {
          title: "Reset your password",
        });
      })
      .post((req) => {
        req.io.route("auth:resetpassword");
      });

    const signupViewOptions = {
      title: "Sign Up",
      providers: oauthProvidersInfo,
      fields: {},
    };

    app
      .route("/signup")
      .get((req, res) => {
        res.render("signup", signupViewOptions);
      })
      .post((req, res) => {
        const { username, email, password } = req.body;
        const errors = [];

        if (!username) {
          errors.push("Username");
        }
        if (!email) {
          errors.push("Email address");
        }
        if (!password) {
          errors.push("Password");
        }

        const newSignupViewOptions = Object.assign({}, signupViewOptions, {
          fields: req.body,
        });

        if (errors.length > 0) {
          res.flash(
            "error",
            `${errors.join(", ")} ${errors.length > 0 ? "are" : "is"} mandatory`
          );
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
            password: hash,
          });

          user.save().then(
            () => {
              req.flash(
                "info",
                "Your account has been created. Please try to logging in now!"
              );
              res.redirect(providers.local.successRedirect);
            },
            (err) => {
              console.error(err);
              res.flash("error", "Sorry, we could not process your request");
              res.render("signup", newSignupViewOptions);
            }
          );
        });
      });

    // Registering auth providers routes and middlewares
    for (const provider in providers) {
      if (providers.hasOwnProperty(provider) && provider !== "local") {
        app.get(`/login/${provider}`, initialize(provider));
        app.get(`/signup/${provider}`, authenticate(provider));
        app.get(`/auth/${provider}/callback`, authenticate(provider));
        app.get(
          `/connect/${provider}`,
          requireLoginRedirect,
          connect(provider)
        );
        app.get(
          `/connect/${provider}/revoke`,
          requireLoginRedirect,
          disconnect(provider)
        );
      }
    }

    /* =API routes= */
    app.post("/api/auth/register", (req, res) => {});

    /* =Socket routes= */
    app.io.route("auth", {
      resetpassword(req, res) {
        // TODO to be implemented
        res.redirect("/profile");
      },
    });
  } else {
    app
      .route("/__backdoor__")
      .get((req, res) => {
        res.render("login", {
          title: "",
          providers: [],
        });
      })
      .post(authenticate("local"));

    app
      .route("/login")
      .get((req, res) => {
        res.render("demo", {
          viewname() {
            return "login";
          },
          title: "",
          providers: [],
        });
      })
      .post((req, res) => {
        const username = req.body.username;
        const User = recorder.model("User");
        const Account = recorder.model("Account");

        Account.where("name", { key: "demo" })
          .then((accounts) => {
            const account = accounts[0];

            const user = new User({
              nickname: username.toLowerCase(),
              firstname: username[0].toUpperCase() + username.substr(1),
              lastname: " ",
              email: getRandomEmail(),
            });

            return user.save().then((newUser) => {
              account.usersId.push(newUser.id);
              return account.save().then(() => {
                req.login(newUser, () => {
                  res.redirect("/chat/demo/messages/central-plaza");
                });
              });
            });
          })
          .catch((err) => {
            console.error(err);
            res.flash("error", "Sorry, we could not process your request");
            res.render("demo", {
              viewname() {
                return "login";
              },
              title: "",
              providers: [],
            });
          });
      });
  }

  app.get("/logout", (req, res) => {
    // Resetting flash messages
    req.session.flash = [];
    req.logout();
    res.redirect("/");
  });
};
