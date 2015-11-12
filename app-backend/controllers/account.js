import recorder from "tape-recorder";

import { requireLogin, requireLoginRedirect } from "../middlewares/auth";
import { requireProfileInfoRedirect } from "../middlewares/profile";
import { requireValidAccount } from "../middlewares/account";

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
    "/settings/:accountName/*",
    "/chat/:accountName/*"
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

  app.get("/api/accounts/:accountId", requireLogin, (req) => {
    req.io.route("accounts:get");
  });

  app.post("/api/accounts/:accountId", requireLogin, (req) => {
    req.io.route("accounts:update");
  });

  app.delete("/api/accounts/:accountId", requireLogin, (req) => {
    req.io.route("accounts:delete");
  });

  app.get("/api/accounts/:accountId/users", requireLogin, requireValidAccount, (req) => {
    req.io.route("accounts:users");
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
      const { accountId } = req.params;
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
            // Joining the corresponding account socket.io room
            console.log(`'${req.user.id}' joining account:${account.id} (${account.name})`);
            req.socket.join(account.id);
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
      const { user } = req;

      function genericFail(error) {
        return res.json({
          ok: false,
          message: `Creation of new account failed.`,
          errors: error
        });
      }

      let account = new Account({
        name: name,
        description: description,
        adminId: user.id,
        usersId: [ user.id ]
      });

      account.save().then(savedAccount => {
        const Room = recorder.model("Room");
        let room = new Room({
          name: "The General Room",
          topic: "This is room is for team-wide communication. All team members can access this room.",
          adminId: user.id,
          accountId: savedAccount.id
        });

        room.save().then(savedRoom => {
          return res.status(201).json({
            ok: true,
            message: `Account '${name}' succesfully created.`,
            account: savedAccount.toAPI(true),
            room: savedRoom.toAPI(true)
          });
        }, genericFail);
      }, genericFail);
    },

    update(req, res) {

    },

    delete(req, res) {

    },

    users(req, res) {
      const User = recorder.model("User");
      //TODO improve by fetching a list of known ID directly instead of looping
      Promise.all(req.account.usersId.map(userId => {
        return User.findById(userId);
      })).then(users => {
        res.json({
          ok: true,
          users: users
        });
      }, error => {
        res.json({
          ok: false,
          message: "Could not fetch users list",
          errors: error
        });
      });
    }
  });

};
