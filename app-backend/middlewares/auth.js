import passport from "passport";

export function requireLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.headers && req.headers.authorization) {
    let [scheme, token] = req.headers.authorization.split(" "), auth;
    if (/^Bearer$/i.test(scheme)) {
      auth = passport.authenticate("bearer", { session: false });
      auth(req, res, next);
    }
  }
  res.status(401).send("You are not authorized to access this resource");
}

export function requireLoginRedirect(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

export function requireEmail(req, res, next) {
  if (req.isAuthenticated() && !req.user.email) {
    req.flash("info", "You have to specify an email address as we use it to recognize you from various auhtentication providers");
    return res.redirect("/profile");
  }
  next();
}
