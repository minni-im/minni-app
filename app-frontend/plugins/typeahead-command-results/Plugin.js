import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;

PluginRegister("CommandResults", COMPOSER_TYPEAHEAD, {
  ResultsPanel,
  reduce() {
    return null;
  }
});
