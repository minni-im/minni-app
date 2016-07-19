import { Constants, register as PluginRegister, PluginsStore } from "../../libs/PluginsToolkit";
import ResultsPanel from "./Results.react";

const {
  COMPOSER_TYPEAHEAD,
  COMPOSER_COMMAND
} = Constants.PLUGIN_TYPES;

const SENTINEL = "/";

PluginRegister("CommandTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  PREFIX: `^${SENTINEL}`,
  ResultsPanel,

  reduce(prefix, index, test) {
    if (index === 0) {
      const COMMANDS = PluginsStore.getPlugins(COMPOSER_COMMAND);
      return COMMANDS.filter(({ command, enabled }) =>
          enabled(command) && test(command)
        ).slice(0, 10);
    }
    return null;
  }
});
