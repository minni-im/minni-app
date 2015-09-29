import { requireLoginRedirect } from "../middlewares/auth";
import { requireProfileInfoRedirect } from "../middlewares/profile";

export default (app) => {


  /* =Routes= */
  app.get([
    "/",
    "/lobby",
    "/lobby/*",
    "/messages",
    "/messages/*"
  ], requireLoginRedirect, requireProfileInfoRedirect, (req, res) => {
    res.render("chat");
  });
};
