import recorder from "tape-recorder";

import passport from "passport";
import passportSocketIo from "passport.socketio";
import BearerStrategy from "passport-http-bearer";

import settings from "../config";
import plugins from "../plugins";

let enabledProviders = [];
let providersSettings = {};

function getProviders() {
  if (!settings.auth.providers) {
    throw new Error(`No auth provider found!
You have to specify at least one in your setting.yml file:

    auth:
      providers: [ github ]
`);
  }
  return settings.auth.providers.map( provider => {
    let Provider = plugins.getPlugin(provider, "auth");
    return {
      key: provider,
      provider: new Provider(settings.auth[provider])
    };
  });
}

function getProvider(key) {
  return enabledProviders.map( p => {
    return p.key === key ? p : false;
  })
  .filter(item => { return item !== false; })[0];
}

function setup (app, session) {
  enabledProviders = getProviders();
  enabledProviders.forEach(p => {
    p.provider.setup();
    providersSettings[p.key] = p.provider.options;
  });

  passport.use(new BearerStrategy((token, done) => {
    let User = recorder.model("User");
    User.findByToken(token)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error);
      });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    let User = recorder.model("User");
    User.findFirst(id).then(user => done(null, user), error => done(error));
  });

  app.use(passport.initialize());
  app.use(passport.session());

  let ioSession = Object.assign({}, session, {
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
        })
        .catch(() => {
          return next("Fail");
        });
    } else {
      psiAuth(socket, next);
    }
  });
}

function action(type) {
  return (provider, req, res) => {
    provider = getProvider(provider).provider;
    return new Promise((resolve, reject) => {
      provider[type].call(provider, req, res, (error, user) => {
        if (error) {
          return reject(error);
        }
        return resolve(user);
      });
    });
  };
}

export default {
  providers: providersSettings,
  setup: setup,
  authenticate: action("authenticate"),
  signup: action("signup")
};
