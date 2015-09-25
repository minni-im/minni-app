import recorder from "tape-recorder";
import cookieParser from "cookie-parser";

import passport from "passport";
import passportSocketIo from "passport.socketio";
import BearerStrategy from "passport-http-bearer";
import LocalProvider from "./local";

import settings from "../config";
import plugins from "../plugins";

let enabledProviders = [];
let providersSettings = {};

function getProviders() {
  if (!settings.auth.providers) {
    throw new Error("No auth provider found! You have to specify at least one in your setting.yml file.");
  }
  return settings.auth.providers.map(provider => {
    let Provider;
    if (provider === "local") {
      Provider = LocalProvider;
    } else {
      Provider = plugins.getPlugin(provider, "auth");
    }

    return {
      key: provider,
      provider: new Provider(settings.auth[provider] || {})
    };
  });
}

function getProvider(key) {
  return enabledProviders.map( p => {
    return p.key === key ? p : false;
  })
  .filter(item => { return item !== false; })[0].provider;
}

function setup (app, session) {

  passport.use(new BearerStrategy((token, done) => {
    let User = recorder.model("User");
    User.findByToken(token)
      .then(user => {
        if (user) {
          user.usingToken = true;
        }
        return done(null, user);
      }, error => {
        return done(error);
      });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    let User = recorder.model("User");
    User.findById(id).then(user => done(null, user), error => done(error));
  });


  enabledProviders = getProviders();
  enabledProviders.forEach(p => {
    p.provider.setup();
    providersSettings[p.key] = p.provider.options;
  });

  // eventual redirection
  app.use((req, res, next) => {
    if (req.query.returnTo) {
      if (req.query.returnTo[0] !== "/") {
        req.query.returnTo = "/" + req.query.returnTo;
      }
      req.session.returnTo = req.query.returnTo;
    }
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session());

  let ioSession = Object.assign({}, session, {
    cookieParser: cookieParser,
    passport: passport
  });
  let psiAuth = passportSocketIo.authorize(ioSession);

  app.io.use((socket, next) => {
    let User = recorder.model("User");
    if (socket.request._query && socket.request._query.token) {
      User.findByToken(socket.request._query.token)
        .then(user => {
          socket.request.user = user;
          socket.request.user.loggedIn = true;
          socket.request.user.usingToken = true;
          return next();
        }, (error) => {
          console.error(error);
          return next("Fail");
        });
    } else {
      psiAuth(socket, next);
    }
  });
}

function action(type) {
  return (provider, ...rest) => {
    provider = getProvider(provider);
    return provider[type].apply(provider, rest);
  };
}

export default {
  providers: providersSettings,
  setup: setup,
  initialize: action("initialize"),
  connect: action("connect"),
  authenticate: action("authenticate"),
  disconnect: action("disconnect")
};
