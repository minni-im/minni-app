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
      .filter(user =>
        user.nickname.startsWith(prefix.slice(1))
      )
      .slice(0, 10);
  }
});
