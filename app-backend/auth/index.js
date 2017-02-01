import recorder from "tape-recorder";
import cookieParser from "cookie-parser";

import passport from "passport";
import passportSocketIo from "passport.socketio";
import BearerStrategy from "passport-http-bearer";
import LocalProvider from "./local";

import settings from "../config";
import { getPlugin } from "../plugins";

import { UserFromSessionDoesNotExistError } from "../errors";

let enabledProviders = [];
const providersSettings = {};

function getProviders() {
  if (!settings.auth.providers) {
    throw new Error(`No auth provider found!
You have to specify at least one in your setting.yml file.`);
  }
  return settings.auth.providers.map((provider) => {
    let Provider;
    if (provider === "local") {
      Provider = LocalProvider;
    } else {
      Provider = getPlugin(provider, "auth");
    }

    return {
      key: provider,
      provider: new Provider(settings.auth[provider] || {})
    };
  });
}

function getProvider(key) {
  return enabledProviders
    .map(p => p.key === key ? p : false) // eslint-disable-line no-confusing-arrow
    .filter(item => item !== false)[0].provider;
}

export function setup(app, session) {
  passport.use(new BearerStrategy((token, done) => {
    const User = recorder.model("User");
    User.findByToken(token)
      .then((user) => {
        if (user) {
          user.usingToken = true;
        }
        done(null, user);
      }, (error) => {
        done(error);
      });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const User = recorder.model("User");
    User.findById(id).then(
      user => done(null, user),
      error => done(new UserFromSessionDoesNotExistError(`Unknown user id to be revived from cookie [id: ${id}]`))
    );
  });


  enabledProviders = getProviders();
  enabledProviders.forEach((p) => {
    p.provider.setup();
    providersSettings[p.key] = p.provider.options;
  });

  // eventual redirection
  app.use((req, res, next) => {
    if (req.query.returnTo) {
      if (req.query.returnTo[0] !== "/") {
        req.query.returnTo = `/${req.query.returnTo}`;
      }
      req.session.returnTo = req.query.returnTo;
    }
    next();
  });

  app.use(passport.initialize());
  app.use(passport.session({
    failWithError: true
  }));

  const ioSession = Object.assign({}, session, {
    cookieParser,
    passport
  });
  const psiAuth = passportSocketIo.authorize(ioSession);
  /* eslint-disable no-underscore-dangle */
  app.io.use((socket, next) => {
    const User = recorder.model("User");
    if (socket.request._query && socket.request._query.token) {
      const { token } = socket.request._query;
      User.findByToken(token)
        .then((user) => {
          socket.request.user = user;
          socket.request.user.loggedIn = true;
          socket.request.user.usingToken = true;
          return next();
        }, (error) => {
          console.error(error);
          return next(new UserFromSessionDoesNotExistError(`Unable to retrieve user with [token: ${token}]`));
        });
    } else {
      psiAuth(socket, next);
    }
  });
  /* eslint-disable */
}

function action(type) {
  return (provider, ...rest) => {
    provider = getProvider(provider);
    return provider[type].apply(provider, rest);
  };
}

export const providers = providersSettings;
export const initialize = action("initialize");
export const connect = action("connect");
export const authenticate = action("authenticate");
export const disconnect = action("disconnect");
