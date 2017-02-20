import { ALL as EMOJIS, MASK_BY_PROVIDER } from "emojify";
import { Constants, register as PluginRegister, Stores } from "minni-plugins-toolkit";
import ResultsPanel from "./Results.react";

const { SettingsStore } = Stores;
const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;
const SENTINEL = ":";

PluginRegister("EmojiTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  ResultsPanel,

  reduce(prefix, index, test) {
    if (prefix.length > 2) {
      const providerMask = MASK_BY_PROVIDER[SettingsStore.getValue("global.emojis_type")];
      return Object.keys(EMOJIS)
        .reduce((matching, emoji) => {
          if (
            test(emoji) &&
            EMOJIS[emoji].mask & providerMask
          ) {
            matching.push(emoji);
          }
          return matching;
        }, [])
        .slice(0, 10);
    }
    return null;
  }
});
