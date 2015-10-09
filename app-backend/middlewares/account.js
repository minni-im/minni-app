import recorder from "tape-recorder";

export function requireValidAccount(req, res, next) {
  const Account = recorder.model("Account");
  Account.findById(req.params.accountId).then(account => {
    if (account) {
      req.account = account;
      next();
    }
  }, error => {
    next(error);
  });
}
