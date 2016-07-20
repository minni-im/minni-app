import Immutable from "immutable";
import deepExtend from "deep-extend";

import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";

import Logger from "../libs/Logger";
const logger = Logger.create("UserSettingsStore");

const DEFAULT_SETTINGS = {
  global: {
    clock24: false,
    emoticons: true,
    emojis_type: "twitter",
    rooms: {
      image_preview: true,
      links_preview: true,
      emphasis: true,
      enter: true
    },
    notification: {
      desktop: false,
      sound: true,
      mentions: true,
      sound_volume: 50
    }
  },
  plugins: {},
  starred: {
    rooms: [],
    messages: []
  }
};

const defaultValues = Immutable.fromJS(DEFAULT_SETTINGS);

function handleConnectionOpen(state, { user }) {
  logger.info(user.settings);
  return state.set("data", Immutable.fromJS(user.settings || {}));
}

function handleSettingsUpdateStart(state) {
  return state.set("saveOnGoing", true);
}

function handleSettingsUpdate(state, { settings }) {
  state = state.set("saveOnGoing", false);
  return state.set("data", Immutable.fromJS(settings));
}

class UserSettingsStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.SETTINGS_UPDATE, handleSettingsUpdateStart);
    this.addAction(ActionTypes.SETTINGS_UPDATE_SUCCESS, handleSettingsUpdate);
  }

  getInitialState() {
    return Immutable.fromJS({
      saveOnGoing: false,
      data: {}
    });
  }

  isSaveOnGoing() {
    return this.getState().get("saveOnGoing", false);
  }

  getSettings() {
    return this.getState().get("data").toJS();
  }

  getSettingsWithDefault() {
    return deepExtend(DEFAULT_SETTINGS, this.getState().get("data").toJS());
  }

  getValue(key, fallbackValue) {
    const split = key.split(".");
    const defaultValue = defaultValues.getIn(split);
    const value = this.getState().get("data").getIn(split, defaultValue);
    if (value !== undefined) {
      return value.toJSON ? value.toJSON() : value;
    }
    return fallbackValue;
  }

  isRoomStarred({ id }) {
    return this.getValue("starred.rooms").includes(id);
  }

  isMessageStarred({ id }) {
    return this.getValue("starred.messages").includes(id);
  }

  getEmojiProviderInfo() {
    const name = this.getValue("global.emojis_type");
    return {
      name,
      type: { apple: "png", emojione: "svg", twitter: "svg" }[name]
    };
  }
}

const instance = new UserSettingsStore(Dispatcher);
export default instance;
