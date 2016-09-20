import recorder from "tape-recorder";

import { requireLogin, requireLoginRedirect } from "../middlewares/auth";
import { requireProfileInfoRedirect } from "../middlewares/profile";
import { requireValidAccount } from "../middlewares/account";

export default (app) => {
  /* =API routes= */
  app.get("/api/invites/:invite", requireLogin, (req) => {
    req.io.route("invites:get");
  });

  /* =Socket routes= */
  app.io.route("invites", {
    get(req) {

    }
  });
};
