import { deselectAccount } from "../utils/RouteUtils";


export const Index = {
  onEnter: deselectAccount,
  getComponents(location, callback) {
    require.ensure([], (require) => {
      callback(null, {
        content: require("./Dashboard.react"),
        sidebar: require("./Sidebar.react")
      })
    });
  }
}


export default Object.assign({
  path: "dashboard"
}, Index);
