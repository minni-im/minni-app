import { deselectAccount } from "../utils/RouteUtils";

export default {
  path: "create",
  onEnter: deselectAccount,
  getComponents(location, callback) {
    require.ensure([], (require) => {
      callback(null, {
        content: require("./Create.react"),
        sidebar: require("./Sidebar.react")
      })
    })
  }
}
