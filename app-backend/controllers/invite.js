import recorder from "tape-recorder";

import { requireLogin, requireLoginRedirect } from "../middlewares/auth";
import { requireProfileInfoRedirect } from "../middlewares/profile";
import { requireValidAccount } from "../middlewares/account";

// TODO: We need a background cron jobs to expire invalid invites

export default (app) => {
  /* =WEB routes= */
  app.route("/invite/:inviteToken")
    .get((req, res) => {
      res.render("invite");
    })
    .post((req, res) => {
      if (req.isXHR) {
        return req.io.route("invites:validate");
      }
    });

  /* =API routes= */
  app.get("/api/accounts/:accountId/invites",
    requireLogin,
    requireValidAccount, (req) => {
      req.io.route("invites:list");
    });

  app.get("/api/invites/:inviteToken", requireLogin, (req) => {
    req.io.route("invites:get");
  });

  app.put("/api/invites/", requireLogin, (req) => {
    req.io.route("invites:create");
  });

  app.delete("/api/invites/:inviteToken", requireLogin, (req) => {
    req.io.route("invites:delete");
  });

  /* =Socket routes= */
  app.io.route("invites", {
    validate(req, res) {
      const Invite = recorder.model("Invite");
      const Account = recorder.model("Account");
      const { inviteToken } = req.params;
      Invite.findByToken(inviteToken)
        .then((invite) => {
          if (invite.isValid()) {
            const { accountId, inviterId } = invite;
            Account.findById(accountId)
              .then((account) => {
                account.usersId.push();
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
        .then(invite => res.json({
          ok: true,
          invite: invite.toAPI()
        }), error => res.status(404).json({
          ok: false,
          errors: error,
          message: `No invite is matching token: ${inviteToken}.`
        }));
    },

    create(req, res) {
      const Invite = recorder.model("Invite");
      const { id: userId } = req;
      const { accountId, maxUsage, maxAge } = req.body;

      Invite.generateToken(
        userId,
        accountId,
        maxAge,
        maxUsage
      ).then(invite => res.status(201).json({
        ok: true,
        accountId,
        invite: invite.toAPI(true),
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

    delete(req) {

    }
  });
};
