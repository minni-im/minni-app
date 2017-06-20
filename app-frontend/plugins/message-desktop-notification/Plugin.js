import { Constants, register as PluginRegister, Stores } from "minni-plugins-toolkit";

import SettingsPanel, {
  SETTING_KEY,
  NOTIFICATION_GRANTED,
  checkPermission
} from "./Settings.react";

const { SettingsStore, UserStore, RoomStore, SelectedAccountStore } = Stores;

const NOTIFICATION_DISPLAY_TIME = 7.5 * 1000; // time in milliseconds

function capitalize(text) {
  return text.replace(/(?:^|\s)([a-z])/g, m => m.toUpperCase());
}

PluginRegister("DesktopNotifications", Constants.PLUGIN_TYPES.MESSAGE, {
  SettingsPanel,

  receiveMessage(decodedMessage, message) {
    const connectedUser = UserStore.getConnectedUser();
    const enabled =
      SettingsStore.getValue(SETTING_KEY) &&
      checkPermission() === NOTIFICATION_GRANTED &&
      connectedUser.id !== message.userId &&
      connectedUser.status !== Constants.USER_STATUS.DND;
    if (enabled) {
      const accountName = capitalize(SelectedAccountStore.getAccount().name);
      const roomName = capitalize(RoomStore.get(message.roomId).name);
      const user = message.userId ? UserStore.getUser(message.userId) : message.bot;
      const username = user.id ? user.firstname : user.name;
      const title = `${accountName}: ${roomName}`;
      const options = {
        body: `${username}: ${decodedMessage}`,
        icon: user.picture,
      };
      const notification = new Notification(title, options);
      notification.onclick = function () {
        window.focus();
        notification.close();
      };
      setTimeout(() => {
        notification.close();
      }, NOTIFICATION_DISPLAY_TIME);

      return message;
    }

    return Promise.resolve(message);
  },
});
