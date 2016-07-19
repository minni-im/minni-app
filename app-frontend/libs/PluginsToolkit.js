import { ActionTypes, PLUGIN_TYPES } from "../Constants";
import { dispatch } from "../Dispatcher";

import Emoji from "../components/Emoji.react";

import Avatar from "../components/generic/Avatar.react";
import Badge from "../components/generic/Badge.react";
import Dialog from "../components/generic/Dialog.react";
import TabBar from "../components/generic/TabBar.react";
import SettingItem from "../components/settings/SettingItem.react";

const { PLUGIN_REGISTER, PLUGIN_UNREGISTER } = ActionTypes;

export { dispatch, dispatchAsync } from "../Dispatcher";

export const Constants = {
  PLUGIN_REGISTER,
  PLUGIN_UNREGISTER,
  PLUGIN_TYPES
};

export { default as SettingsStore } from "../stores/UserSettingsStore";
export { default as PluginsStore } from "../stores/PluginsStore";

export function register(name, type, plugin) {
  name = name.toLowerCase();
  dispatch({
    type: PLUGIN_REGISTER,
    plugin: {
      ...plugin,
      name,
      type
    }
  });
}

export const UI = {
  Avatar,
  Badge,
  Dialog,
  Emoji,
  TabBar,
  SettingItem
};
