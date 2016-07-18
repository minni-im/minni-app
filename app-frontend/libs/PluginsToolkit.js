import { ActionTypes, PLUGIN_TYPES } from "../Constants";
import { dispatch } from "../Dispatcher";

const { PLUGIN_REGISTER, PLUGIN_UNREGISTER } = ActionTypes;

export { dispatch, dispatchAsync } from "../Dispatcher";

export const Constants = {
  PLUGIN_REGISTER,
  PLUGIN_UNREGISTER,
  PLUGIN_TYPES
};

export { default as SettingItem } from "../components/settings/SettingItem.react";

export { default as SettingsStore } from "../stores/UserSettingsStore";
export { default as PluginsStore } from "../stores/PluginsStore";


export function register(name, type, plugin) {
  dispatch({
    type: PLUGIN_REGISTER,
    plugin: {
      ...plugin,
      name,
      type
    }
  });
}
