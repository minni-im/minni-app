import { Constants, register as PluginRegister } from "../../libs/PluginsToolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;

const COMMAND_ENABLED = () => true;
const COMMAND_DISABLED = () => false;

const COMMANDS = [
  {
    command: "gif",
    title: "Buukkit",
    description: "Search animated gifs on http://buukkit.appspot.com",
    enabled: COMMAND_ENABLED,
    typeahead: true,
    images: true
  }, {
    command: "me",
    title: "Me",
    description: "What are you doing ?",
    enabled: COMMAND_DISABLED
  }, {
    command: "giphy",
    title: "Giphy",
    description: "Search animated gifs from Giphy",
    enabled: COMMAND_DISABLED,
    typeahead: true,
    images: true
  }
];

const SENTINEL = "/";
const COMMAND_RE_TEXT = `^/(${COMMANDS.filter(c => c.typeahead)
    .map(c => c.command)
    .join("|")
  })\\s(.+)`;
const COMMAND_RE = new RegExp(COMMAND_RE_TEXT, "i");

PluginRegister("CommandTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  PREFIX: `^${SENTINEL}`,
  RE: COMMAND_RE,
  ResultsPanel,

  match(text) {

  },

  reduce(prefix) {

  }
});
