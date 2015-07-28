import express from "express.oi";
import session from "express-session";
import redis from "redis";
import cookieParser from "cookie-parser";
import connectRedis from "connect-redis";

var RedisStore = connectRedis(session);
var app = express();

app.http().io();

app.use(cookieParser());
app.use(session({
  store: new RedisStore(),
  secret: "SuperSecretSauce",
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 15778800000
  }
}));

app.io.set("store", new RedisStore({
    redisPub: redis.createClient(),
    redisSub: redis.createClient(),
    redisClient: redis.createClient()
}));
