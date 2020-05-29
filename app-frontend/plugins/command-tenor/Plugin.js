import { Constants, register as PluginRegister } from "minni-plugins-toolkit";

const { PLUGIN_TYPES } = Constants;

PluginRegister("TenorCommand", PLUGIN_TYPES.COMPOSER_COMMAND, {
  command: "tenor",
  title: "Tenor",
  description: "Search animated gifs on https://tenor.com",
  enabled: () => true,
  typeahead: true,
  images: true,
});
