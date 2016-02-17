import Immutable from "immutable";


export const DEFAULT_SETTINGS = {
  global: {
    clock24: false,
    notification: {
      desktop: false,
      sound: true,
      soundVolume: 100
    }
  },
  aliases: {},
  starred: {
    rooms: [],
    messages: []
  }
};

const SettingsRecord = Immutable.Record(DEFAULT_SETTINGS);

export default class Settings extends SettingsRecord {
  getValue(key) {
    return false;
  }

  isRoomStarred(roomId) {
    return this.starred.rooms.indexOf(roomId) !== -1;
  }

  get soundEnabled() {
    return this.global.notification.sound;
  }

  getSoundVolume() {
    return this.global.notification.soundVolume;
  }
}
