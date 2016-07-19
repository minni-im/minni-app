import { Constants, register as PluginRegister, SettingsStore } from "../../libs/PluginsToolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;
const SENTINEL = ":";

PluginRegister("EmojiTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  ResultsPanel,

  match(text) {

  },

  reduce(prefix) {
    
  }
});
