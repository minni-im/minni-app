export function requireProfileInfoRedirect(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (!req.user.firstname && req.user.fullname === req.user.nickname) {
    req.flash("info", "Do you have a couple of minutes to complete your profile ?");
    return res.redirect("/profile");
  }
  next();
}

export function requireEmailRedirect(req, res, next) {
  if (req.isAuthenticated() && !req.user.email) {
    req.flash("info", "You have to specify an email address as we use it to recognize you from various auhtentication providers");
    return res.redirect("/profile");
  }
  next();
}
