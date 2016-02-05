import { selectAccount } from "../utils/RouteUtils";

export default {
  path: "settings/:accountSlug",
  onEnter: selectAccount,
  getComponents(location, callback) {
    require.ensure([], (require) => {
      callback(null, {
        content: require("./Settings.react"),
        sidebar: require("../layout/MainSidebar.react")
      })
    })
  }
}
