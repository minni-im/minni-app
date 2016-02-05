import { selectAccount } from "../utils/RouteUtils";

import Lobby, { Index } from "./routes/lobby";
import Create from "./routes/room-create";

import Chat from "./Chat.react";
import Sidebar from "../layout/MainSidebar.react";

export default {
  path: "chat/:accountSlug",
  onEnter: selectAccount,
  components: {
    content: Chat,
    sidebar: Sidebar
  },
  indexRoute: Index,
  childRoutes: [
    Lobby,
    Create
  ]
}
