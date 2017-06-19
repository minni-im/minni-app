import { ActionTypes, PLUGIN_TYPES, USER_STATUS } from "../Constants";
import { dispatch } from "../Dispatcher";

import Emoji from "../components/Emoji.react";
import TypeaheadResults from "../components/TypeaheadResults.react";

import Avatar from "../components/generic/Avatar.react";
import Badge from "../components/generic/Badge.react";
import Dialog from "../components/generic/Dialog.react";
import TabBar from "../components/generic/TabBar.react";
import SettingItem from "../components/settings/SettingItem.react";
import UserStatus from "../components/UserStatus.react";
import UserStatusIcon from "../components/UserStatusIcon.react";

import "../stores/SlashCommandStore";

const { PLUGIN_REGISTER, PLUGIN_UNREGISTER } = ActionTypes;

export { dispatch, dispatchAsync } from "../Dispatcher";

export const Constants = {
  PLUGIN_REGISTER,
  PLUGIN_UNREGISTER,
  PLUGIN_TYPES,
  USER_STATUS,
};

export { default as Stores } from "../stores/PluginStores.js";

export function register(name, type, plugin) {
  name = name.toLowerCase();
  if (plugin.name || plugin.type) {
    throw new TypeError(
      `Plugin ${name}: properties 'name' and 'type' are reserved keyword and cannot be used.`
    );
  }

  if (type & PLUGIN_TYPES.COMPOSER_TEXT && plugin.encodeMessage === undefined) {
    throw new TypeError(`Plugin ${name} should declare an 'encodeMessage()' method.`);
  }

  if (type & PLUGIN_TYPES.MESSAGE && plugin.receiveMessage === undefined) {
    throw new TypeError(`Plugin ${name} should declare a 'receiveMessage()' method.`);
  }

  if (type & PLUGIN_TYPES.COMPOSER_TYPEAHEAD) {
    if (plugin.SENTINEL === undefined) {
      throw new TypeError(`Plugin ${name} should declare a 'SENTINEL'.`);
    }

    if (plugin.reduce === undefined || (plugin.reduce && typeof plugin.reduce !== "function")) {
      throw new TypeError(`Plugin ${name} should declare a 'reduce()' method.`);
    }

    if (plugin.ResultsPanel === undefined) {
      throw new TypeError(`Plugin ${name} should declare a 'ResultsPanel' React component.`);
    }
  }

  dispatch({
    type: PLUGIN_REGISTER,
    plugin: {
      ...plugin,
      name,
      type,
    },
  });
}

export const UI = {
  Avatar,
  UserStatus,
  UserStatusIcon,
  Badge,
  Dialog,
  Emoji,
  TabBar,
  SettingItem,
  TypeaheadResults,
};
