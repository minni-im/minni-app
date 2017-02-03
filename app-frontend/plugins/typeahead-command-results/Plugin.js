import { Constants, register as PluginRegister } from "minni-plugins-toolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;

PluginRegister("CommandResults", COMPOSER_TYPEAHEAD, {
  SENTINEL: null,
  ResultsPanel,
  reduce() {
    return null;
  }
});
