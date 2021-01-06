import { Constants, register as PluginRegister } from "minni-plugins-toolkit";

const { PLUGIN_TYPES } = Constants;
const COMMAND_TRIM = "/shrug ";
const SHRUG = "¯\\_(ツ)_/¯";
const SHRUG_NO_MARKDWON = "¯\\\\\\_(ツ)_/¯";

PluginRegister(
  "ShrugCommand",
  PLUGIN_TYPES.COMPOSER_COMMAND | PLUGIN_TYPES.COMPOSER_TEXT,
  {
    command: "shrug",
    title: "Shrug",
    description: `Appends ${SHRUG} to your message`,
    enabled: () => true,
    encodeMessage(message) {
      if (message.content.startsWith(COMMAND_TRIM)) {
        message.content = `${message.content.replace(
          COMMAND_TRIM,
          ""
        )} ${SHRUG_NO_MARKDWON}`;
      }
      return Promise.resolve(message);
    },
  }
);
