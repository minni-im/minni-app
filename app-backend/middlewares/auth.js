import passport from "passport";

export function requireLogin(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  if (req.headers && req.headers.authorization) {
    const [scheme, token] = req.headers.authorization.split(" "); // eslint-disable-line no-unused-var
    let auth;
    if (/^Bearer$/i.test(scheme)) {
      auth = passport.authenticate("bearer", { session: false });
      auth(req, res, next);
      return;
    }
  }
  res.status(401).send("You are not authorized to access this resource");
}

export function requireLoginRedirect(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect("/login");
}
