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

app.use(cookieParser());
app.io.session(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.route("/")
  .get((req, res) => {
    res.send(config);
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
    "default": CouchWaterline,
    "couch": CouchWaterline
  },
  connections: {
    minniCouch: {
      adapter: "couch",
      host: process.env.COUCHDB_PORT_5984_TCP_ADDR || config.couchdb.host,
      port: process.env.COUCHDB_PORT_5984_TCP_PORT || config.couchb.port
    }
  }
};
fs.readdirSync(path.join(__dirname, "models")).forEach(model => {
  waterline.loadCollection(require("./models/" + model));
});

waterline.initialize(waterlineConfig, (error, ontology) => {
  if (error) {
    throw error;
  }
  bootstrap();
});
