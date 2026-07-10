import { Constants, register as PluginRegister } from "minni-plugins-toolkit";

const { PLUGIN_TYPES } = Constants;

PluginRegister("KlipyCommand", PLUGIN_TYPES.COMPOSER_COMMAND, {
    command: "klipy",
    title: "Klipy",
    description: "Search animated gifs on https://klipy.com",
    enabled: () => true,
    typeahead: true,
    images: true,
});
