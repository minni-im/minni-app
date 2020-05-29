import { Constants, register as PluginRegister } from "minni-plugins-toolkit";

const { PLUGIN_TYPES } = Constants;

PluginRegister("BuukkitCommand", PLUGIN_TYPES.COMPOSER_COMMAND, {
  command: "gif",
  title: "Buukkit",
  description: "Search animated gifs on http://buukkit.appspot.com",
  enabled: () => !window.Minni.demo,
  typeahead: true,
  images: true,
});
