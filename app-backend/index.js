import fs from "fs";
import path from "path";
import express from "express.oi";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectRedis from "connect-redis";

import Waterline from "waterline";
import CouchWaterline from "sails-couchdb-orm";

import config from "./config";

let RedisStore = connectRedis(express.session);
let app = express();

app.http().io();

let sessionStore = new RedisStore({
  host: process.env.REDIS_PORT_6379_TCP_ADDR || config.redis.host,
  port: process.env.REDIS_PORT_6379_TCP_PORT || config.redis.port
});
let session = {
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

app.use(cookieParser());
app.io.session(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.route("/")
  .get((req, res) => {
    app.get("models").user.create({
      firstName: "Benoit",
      lastName: "Charbonnier"
    }, function(error, user) {
      res.render("chat", {
        config: user
      });
    });
  });

let bootstrap = () => {
  let port = config.port;
  let host = config.host;

  app.listen(port, host);
  console.log("Minni application started and listenning on http://%s:%s", host, port);
};

let waterline = new Waterline();
let waterlineConfig = {
  adapters: {
    "couchdbConnector": CouchWaterline
  },
  connections: {
    "couchdb": {
      adapter: "couchdbConnector",
      host: process.env.COUCHDB_PORT_5984_TCP_ADDR || config.couchdb.host,
      port: process.env.COUCHDB_PORT_5984_TCP_PORT || config.couchb.port
    }
  }
};
fs.readdirSync(path.join(__dirname, "models")).forEach(model => {
  waterline.loadCollection(require("./models/" + model));
});

waterline.initialize(waterlineConfig, (error, models) => {
  if (error) {
    throw error;
  }
  app.set("models", models.collections);
  bootstrap();
});
