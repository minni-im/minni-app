import Layout from "./Layout.react";

import Create from "../create";
import Chat from "../chat";
import Messages from "../chat-messages";
import Dashboard, { Index } from "../dashboard";
import Settings from "../settings";

export default {
  path: "/",
  component: Layout,
  indexRoute: Index,
  childRoutes: [
    Create,
    Chat,
    Dashboard,
    Messages,
    Settings
  ]
}
