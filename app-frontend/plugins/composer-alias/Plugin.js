import { Constants, register as PluginRegister, SettingsStore } from "../../libs/PluginsToolkit";
import SettingsPanel from "./Settings.react";

const { COMPOSER_TEXT } = Constants.PLUGIN_TYPES;

const MATCHING = (alias) => `(?:^|\\s+)${alias}(?:\\s+|$)`;
const SUPER_ALIAS = /(.*)(\/.+\/.+\/)$/;
const PROCESS_SUPER_ALIAS = /([\w&.-]+)\/([^\/]+)\/([^\/]+)\//g;

function isSuperAlias(text) {
  return SUPER_ALIAS.test(text);
}

function escapeExpr(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function replaceAliases(text) {
  const aliases = SettingsStore.getValue("plugins.aliases.list", {});
  Object.keys(aliases).forEach(alias => {
    const subst = aliases[alias];
    if (alias.startsWith("/") && alias.endsWith("/")) {
      alias = alias.substring(1, alias.length - 1);
    } else {
      alias = escapeExpr(alias);
    }
    const toBeMatched = new RegExp(MATCHING(alias), "g");
    if (toBeMatched.test(text)) {
      text = text.replace(new RegExp(alias, "g"), subst);
      if (isSuperAlias(subst)) {
        text = text.replace(PROCESS_SUPER_ALIAS,
          (matches, intermediateText, regex, repl) =>
            intermediateText.replace(new RegExp(escapeExpr(regex), "g"), repl)
        );
      }
    }
  });
  return text;
}

PluginRegister("Aliases", COMPOSER_TEXT, {
  SettingsPanel,

  encodeMessage(message) {
    const enabled = SettingsStore.getValue("plugins.aliases.active");
    if (!enabled) {
      return Promise.resolve(message);
    }
    message.content = replaceAliases(message.content);
    return Promise.resolve(message);
  }
});
