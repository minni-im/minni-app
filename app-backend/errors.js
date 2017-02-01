export class OAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = "OAuthError";
  }
}

export class UserFromSessionDoesNotExistError extends OAuthError {
  constructor(message) {
    super(message);
    this.name = "UserFromSessionDoesNotExistError";
  }
}


export function OAuthErrorHandler(config) {
  return function (err, req, res, next) {
    if (err instanceof UserFromSessionDoesNotExistError) {
      console.error(`${err.name}: ${err.message}`);
      res.clearCookie(config.session.key);
      res.redirect("/login");
      return;
    }
    next(err);
  };
}

export function ClientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.json(500, { error: "Something went wrong!" });
    return;
  }
  next(err);
}
