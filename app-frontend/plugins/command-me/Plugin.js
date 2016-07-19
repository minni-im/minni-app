import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";

const { PLUGIN_TYPES } = Constants;

PluginRegister("MeCommand", PLUGIN_TYPES.COMPOSER_COMMAND, {
  command: "me",
  title: "Me",
  description: "What are you doing ?",
  enabled: () => true,

  encodeMessage(message) {
    return Promise.resolve(message);
  }
});
