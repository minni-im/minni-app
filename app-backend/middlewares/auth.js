import passport from "passport";

export function requireBearerLogin(req, res, next) {
  if (req.user) {
    next();
    return;
  }
  if (req.headers && req.headers.authorization) {
    let [scheme, token] = req.headers.authorization.split(" "), auth;
    if (/^Bearer$/i.test(scheme)) {
      auth = passport.authenticate("bearer", { session: false });
      auth(req, res, next);
    }
  }
  res.status(401).send();
}
