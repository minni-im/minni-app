import { Constants, register as PluginRegister } from "minni-plugins-toolkit";

const { PLUGIN_TYPES } = Constants;

const COMMAND_TRIM = "/me ";

PluginRegister("MeCommand",
  PLUGIN_TYPES.COMPOSER_COMMAND | PLUGIN_TYPES.COMPOSER_TEXT,
  {
    command: "me",
    title: "Me",
    description: "What are you doing ?",
    enabled: () => false,
    encodeMessage(message) {
      if (message.content.startsWith("/me ")) {
        message.content = `_${message.content
          .replace(COMMAND_TRIM, "")}_`;
      }
      return Promise.resolve(message);
    }
  }
);
