export function requireProfileInfoRedirect(req, res, next) {
  if (!req.isAuthenticated()) {
    next();
    return;
  }
  if (!req.user.firstname && req.user.fullname === req.user.nickname) {
    req.flash("info", "Do you have a couple of minutes to complete your profile ?");
    res.redirect("/profile");
    return;
  }
  next();
}

export function requireEmailRedirect(req, res, next) {
  if (req.isAuthenticated() && !req.user.email) {
    req.flash(
      "info",
      "You have to specify an email address as we use it to recognize you" +
      "from various auhtentication providers"
    );
    res.redirect("/profile");
    return;
  }
  next();
}
