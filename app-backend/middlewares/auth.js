import passport from "passport";


export function requireUsernamePassword(req, res, next) {
  const { username, password } = req.body;
  const mandatoryFields = {};
  if (!username || username.length === 0) {
    mandatoryFields.username = "You must specify a username";
  }
  if (!password || password.length === 0) {
    mandatoryFields.password = "You must specify a password";
  }

  if (Object.keys(mandatoryFields).length > 0) {
    // TODO: find a way to detect fetch request as we used to do with xhr
    // if (req.xhr) {
    res.status(400).json({
      ok: false,
      fields: mandatoryFields,
      message: "Invalid authentication"
    });
    return;
    // }
    // res.status(400).send("Invalid authentication");
    // return;
  }
  next();
}

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
