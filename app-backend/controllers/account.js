import recorder from "tape-recorder";

import { requireLogin, requireLoginRedirect } from "../middlewares/auth";
import { requireProfileInfoRedirect } from "../middlewares/profile";


function sanitizeName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default (app) => {

  /* =Routes= */
  app.get([
    "/",
    "/create",
    "/dashboard",
    "/chat/*"
  ], requireLoginRedirect, requireProfileInfoRedirect, (req, res) => {
    const Account = recorder.model("Account");
    Account.getListForUser(req.user.id).then((accounts) => {
      res.render("chat", {
        accounts: accounts.map(account => {
          return account.toAPI(req.user.id === account.adminId);
        })
      });
    });
  });

  /* =API routes= */

  app.get("/api/accounts/", requireLogin, (req) => {
    req.io.route("accounts:list");
  });

  app.put("/api/accounts/", requireLogin, (req) => {
    req.io.route("accounts:create");
  });

  app.get("/api/accounts/check_existence", requireLogin, (req) => {
    req.io.route("accounts:check");
  });

  app.get("/api/accounts/:id", requireLogin, (req) => {
    req.io.route("accounts:get");
  });

  app.post("/api/accounts/:id", requireLogin, (req) => {
    req.io.route("accounts:update");
  });

  app.delete("/api/accounts/:id", requireLogin, (req) => {
    req.io.route("accounts:delete");
  });

  /* =Socket routes= */
  app.io.route("accounts", {
    check(req, res) {
      let name = sanitizeName(req.query.name);
      const Account = recorder.model("Account");
      Account.where("name", { key: name }).then(accounts => {
        if (accounts.length) {
          return res.json({
            ok: false,
            message: `Account '${name}' is already taken`
          });
        }
        return res.json({
          ok: true,
          message: `Account '${name}' is available`
        });
      });
    },

    get(req, res) {
      const accountId = req.params.id;
      const Account = recorder.model("Account");

      Account.findById(accountId).then(account => {
        if (account === false) {
          return res.json({
            ok: false,
            message: "This resource does not exist"
          });
        }
        return res.json({
          ok: true,
          account: account.toAPI(req.user.id === account.adminId)
        });
      }, error => {
        res.json({
          ok: false,
          message: `This resource does not exist`,
          errors: error
        });
      });
    },

    list(req, res) {
      const Account = recorder.model("Account");
      Account.getListForUser(req.user.id).then(accounts => {
        res.json({
          ok: true,
          accounts: accounts.map(account => {
            return account.toAPI(req.user.id === account.adminId);
          })
        });
      })
      .catch(error => {
        res.json({
          ok: false,
          errors: error
        });
      });
    },

    create(req, res) {
      let name = sanitizeName(req.body.name);
      let description = req.body.description;
      const Account = recorder.model("Account");

      let account = new Account({
        name: name,
        description: description,
        adminId: req.user.id,
        users: [ req.user.id ]
      });
      account.save().then(savedAccount => {
        return res.status(201).json({
          ok: true,
          message: `Account '${name}' succesfully created.`,
          account: savedAccount.toAPI(true)
        });
      }, error => {
        return res.json({
          ok: false,
          message: `Creation of new account failed.`,
          errors: error
        });
      });
    },

    update(req, res) {

    },

    delete(req, res) {

    }
  });

};
