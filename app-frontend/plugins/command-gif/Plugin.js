import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";

const { PLUGIN_TYPES } = Constants;

PluginRegister("GifCommand", PLUGIN_TYPES.COMPOSER_COMMAND, {
  command: "gif",
  title: "Buukkit",
  description: "Search animated gifs on http://buukkit.appspot.com",
  enabled: () => true,
  typeahead: true,
  images: true
});
