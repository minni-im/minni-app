/* eslint global-require: 0 */
import fs from "fs";
import path from "path";
import express from "express.oi";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import flash from "flash";
import connectRedis from "connect-redis";
import recorder from "tape-recorder";

import { setup as authSetup } from "./auth";
import config from "./config";
import expressLocals from "./express-locals";

const RedisStore = connectRedis(express.session);
const app = express();

const asciiLogo = (banner) => `══════════════════════════════════════════════════════
███╗   ███╗██╗███╗   ██╗███╗   ██╗██╗   ██╗███╗   ███╗
████╗ ████║██║████╗  ██║████╗  ██║██║   ██║████╗ ████║
██╔████╔██║██║██╔██╗ ██║██╔██╗ ██║██║   ██║██╔████╔██║
██║╚██╔╝██║██║██║╚██╗██║██║╚██╗██║██║   ██║██║╚██╔╝██║
██║ ╚═╝ ██║██║██║ ╚████║██║ ╚████║██║██╗██║██║ ╚═╝ ██║
╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚═╝╚═╝╚═╝     ╚═╝
╔════════════════════════════════════════════════════╝
║ ${banner}
╚═════════════════════════════════════════════════════`;

app.http().io();

const sessionStore = new RedisStore({
  host: process.env.REDIS_PORT_6379_TCP_ADDR || config.redis.host,
  port: process.env.REDIS_PORT_6379_TCP_PORT || config.redis.port
});
const session = {
  key: config.session.key,
  store: sessionStore,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 15778800000
  }
};

app.set("view engine", "jade");
app.set("views", path.join(__dirname, "views"));

function bootstrap() {
  app.use(cookieParser());
  app.io.session(session);

  authSetup(app, session);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(flash());
  expressLocals.setup(app);

  fs.readdirSync(path.join(__dirname, "controllers")).forEach(ctrl => {
    require(`./controllers/${ctrl}`).default(app);
  });

  const { port, host } = config;

  app.listen(port, host);
  console.log("Minni application started and listenning on http://%s:%s", host, port);
}

const couchDBHost = process.env.COUCHDB_PORT_5984_TCP_ADDR || config.couchdb.host;
const couchDBPort = process.env.COUCHDB_PORT_5984_TCP_PORT || config.couchdb.port;

console.log(asciiLogo("Starting application server"));

recorder.connect(`http://${couchDBHost}:${couchDBPort}`, config.couchdb.name, () => {
  fs.readdirSync(path.join(__dirname, "models")).forEach(model => {
    require(`./models/${model}`);
    console.log(`Model '${model}' has been loaded`);
  });
  bootstrap();
});
