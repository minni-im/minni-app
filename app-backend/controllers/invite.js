import recorder from "tape-recorder";

import { requireLogin } from "../middlewares/auth";
import { requireValidAccount } from "../middlewares/account";

// TODO: We need a background cron jobs to delete expired invites

export default (app) => {
  /* =WEB routes= */
  app.route("/invite/:inviteToken")
    .get((req) => {
      req.io.route("invites:get");
    })
    .post((req) => {
      req.io.route("invites:accept");
    });

  /* =API routes= */
  app.get("/api/accounts/:accountId/invites",
    requireLogin,
    requireValidAccount, (req) => {
      req.io.route("invites:list");
    });

  app.put("/api/invites/", requireLogin, (req) => {
    req.io.route("invites:create");
  });

  app.route("/api/invites/:inviteToken")
    .all(requireLogin)
    .get((req) => {
      req.io.route("invites:get");
    })
    .post((req) => {
      req.io.route("invites:accept");
    })
    .delete((req) => {
      req.io.route("invites:delete");
    });

  /* =Socket routes= */
  app.io.route("invites", {
    accept(req, res) {
      const Invite = recorder.model("Invite");
      const Account = recorder.model("Account");
      const { inviteToken } = req.params;
      Invite.findByToken(inviteToken)
        .then((invite) => {
          if (!invite.expired) {
            const { accountId } = invite;
            Account.findById(accountId)
              .then((account) => {
                account.usersId.push(req.user.id);
                return account.save();
              })
              .then((savedAccount) => {
                invite.usage += 1;
                return invite.save()
                  .then(savedInvite => [savedAccount, savedInvite]);
              })
              .then(([savedAccount, savedInvite]) => {
                savedAccount = savedAccount.toAPI(false);
                app.io.in(savedAccount.id)
                  .emit("account:join", {
                    user: req.user.toAPI(),
                    account: savedAccount
                  });
                res.json({
                  ok: true,
                  invite: savedInvite.toAPI(false),
                  account: savedAccount
                });
              });
          }
        }, (error) => {
          res.status(500).json({
            ok: false,
            errors: error
          });
        });
    },

    list(req, res) {
      const Invite = recorder.model("Invite");
      const { account, user } = req;
      const isUserAdmin = user.id === account.adminId;
      Invite.where("accountId", { key: account.id })
        .then((invites) => {
          res.json({
            ok: true,
            invites: invites.map(invite => invite.toAPI(isUserAdmin))
          });
        });
    },

    get(req, res) {
      const Invite = recorder.model("Invite");
      const { inviteToken } = req.params;
      Invite.findByToken(inviteToken)
        .then((invite) => {
          if (req.xhr) {
            const payload = {
              ok: !invite.expired,
              invite: invite.toAPI()
            };
            if (invite.expired) {
              payload.message = "This invitation linked has expired.";
            }
            res.json(payload);
            return;
          }
          res.render("invite", {
            invite: invite.toAPI()
          });
        }, (error) => {
          if (req.xhr) {
            res.status(404).json({
              ok: false,
              errors: error,
              message: `No invite is matching token: ${inviteToken}.`
            });
            return;
          }
          req.redirect("/");
        });
    },

    create(req, res) {
      const Invite = recorder.model("Invite");
      const { id: userId } = req.user;
      const { accountId, maxUsage, maxAge } = req.body;

      Invite.generateToken(
        userId,
        accountId,
        maxAge,
        maxUsage
      ).then(invite => res.status(201).json({
        ok: true,
        accountId,
        invite: invite.toAPI(),
        message: `Invite has been created for team '${accountId}'.`
      }), (error) => {
        console.error("[Invite] Creation failed", error);
        return res.status(500).json({
          ok: false,
          accountId,
          errors: error,
          message: `Invite creation for team '${accountId}' failed.`
        });
      });
    },

    delete(req, res) {
      const Invite = recorder.model("Invite");
      const { inviteToken } = req.params;
      console.log("About to remove inivite:", inviteToken);
      Invite.findByToken(inviteToken)
        .then(invite => invite.remove())
        .then((invite) => {
          res.json({
            ok: true,
            invite: invite.toAPI()
          });
          return;
        }, (error) => {
          res.status(500).json({
            ok: false,
            inviteToken,
            errors: error,
            message: "Failed to delete invitation"
          });
          return;
        });
    }
  });
};
