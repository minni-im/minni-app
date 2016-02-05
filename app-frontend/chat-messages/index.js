import { selectAccount } from "../utils/RouteUtils";

export default {
  path: "chat/:accountSlug/messages",
  onEnter: selectAccount,
  getComponents(location, callback) {
    require.ensure([], (require) => {
      callback(null, {
        content: require("./MultiRoomContainer.react"),
        sidebar: require("../layout/MainSidebar.react")
      });
    });
  },
  getChildRoutes(location, callback) {
    require.ensure([], (require) => {
      callback(null, [
        require("./routes/rooms")
      ])
    });
  }
}
