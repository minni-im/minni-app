/* eslint global-require: 0 */
import fs from "fs";
import path from "path";
import recorder from "@minni-im/tape-recorder";
import express from "express.oi";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import flash from "flash";
import redis from "redis";
import connectRedis from "connect-redis";

import { setup as authSetup } from "./auth";
import config from "./config";
import expressLocals from "./express-locals";

import * as ErrorHandlers from "./errors";

const RedisStore = connectRedis(express.session);
const app = express();

const DOCKER = !!process.env.DOCKER;
const REDIS_CONF = {
  host: DOCKER ? "redis" : config.redis.host,
  port: DOCKER ? 6379 : config.redis.port,
};

const asciiLogo = (banner) => `

╒══════════════════════════════════════════════════════════╕
███╗┈┈┈███╗┈██╗┈███╗┈┈┈██╗┈███╗┈┈┈██╗┈██╗┈┈┈██╗┈███╗┈┈┈███╦╡
████╗┈████║┈██║┈████╗┈┈██║┈████╗┈┈██║┈██║┈┈┈██║┈████╗┈████║│
██╔████╔██║┈██║┈██╔██╗┈██║┈██╔██╗┈██║┈██║┈┈┈██║┈██╔████╔██║│
██║╚██╔╝██║┈██║┈██║╚██╗██║┈██║╚██╗██║┈██║┈┈┈██║┈██║╚██╔╝██║│
██║┈╚═╝┈██║┈██║┈██║┈╚████║┈██║┈╚████║┈██║██╗██║┈██║┈╚═╝┈██║│
╘═╝┈┈┈┈┈╚═╝┈╚═╝┈╚═╝┈┈╚═══╝┈╚═╝┈┈╚═══╝┈╚═╝╚═╝╚═╝┈╚═╝┈┈┈┈┈╚═╩╡
╒══════════════════════════════════════════════════════════╡
├ ${banner}
╘══════════════════════════════════════════════════════════╛`;

app.http().io();
const sessionStore = new RedisStore(REDIS_CONF);
const session = {
  key: config.session.key,
  store: sessionStore,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  unset: "destroy",
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 15778800000,
  },
};

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.set("cache", redis.createClient(REDIS_CONF));
app.enable("trust proxy");

function bootstrap() {
  app.use(cookieParser());
  app.io.session(session);

  authSetup(app, session);

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(flash());
  expressLocals.setup(app);

  fs.readdirSync(path.join(__dirname, "controllers")).forEach((ctrl) => {
    require(`./controllers/${ctrl}`).default(app);
  });

  fs.readdirSync(path.join(__dirname, "libs", "commands")).forEach(
    (command) => {
      require(`./libs/commands/${command}`).setup(app);
    }
  );

  /* =Errors= */
  app.use(ErrorHandlers.OAuthErrorHandler(config));
  app.use(ErrorHandlers.ClientErrorHandler);

  const { port, host } = config;
  app.listen(port, host);
  console.log(
    "Minni application started and listenning on http://%s:%s",
    host,
    port
  );
}

const couchDBHost = DOCKER ? "couchdb" : config.couchdb.host;
const couchDBPort = DOCKER ? 5984 : config.couchdb.port;
const couchDBUser = config.couchdb.user;
const couchDBPassword = config.couchdb.password;

if (config.demo) {
  console.log(asciiLogo("Starting application server, demo mode active"));
} else {
  console.log(asciiLogo("Starting application server"));
}

recorder.connect(
  `http://${couchDBHost}:${couchDBPort}`,
  config.couchdb.name,
  {
    requestDefaults: {
      auth: {
        username: couchDBUser,
        password: couchDBPassword,
      },
    },
  },
  () => {
    fs.readdirSync(path.join(__dirname, "models")).forEach((model) => {
      require(`./models/${model}`);
      console.log(`Model '${model}' has been loaded`);
    });
    bootstrap();
  }
);
