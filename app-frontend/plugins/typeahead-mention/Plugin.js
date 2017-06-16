import UserStore from "../../stores/UserStore";
import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;
const SENTINEL = "@";

PluginRegister("MentionTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  ResultsPanel,

  reduce(prefix) {
    return UserStore.getAll()
      .filter((user) => {
        const match = prefix.slice(1);
        return (
          (user.nickname && user.nickname.startsWith(match)) ||
          user.lastname.includes(match) ||
          user.firstname.includes(match)
        );
      })
      .slice(0, 10);
  },
});
