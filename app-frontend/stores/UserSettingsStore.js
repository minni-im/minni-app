import Immutable from "immutable";
import deepExtend from "deep-extend";

import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";

import Logger from "../libs/Logger";
const logger = Logger.create( "UserSettingsStore" );


const DEFAULT_SETTINGS = {
  global: {
    clock24: false,
    emoticons: true,
    emojis_type: "twitter",
    rooms: {
      image_preview: true,
      links_preview: false,
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
  plugins: {
    aliases: {}
  },
  starred: {
    rooms: [],
    messages: []
  }
};

function handleConnectionOpen( state, { user } ) {
  const settings = deepExtend(DEFAULT_SETTINGS, user.settings);
  logger.info(settings);
  return Immutable.fromJS(settings);
}

class UserSettingsStore extends MapStore {
  initialize() {
    this.addAction( ActionTypes.CONNECTION_OPEN, handleConnectionOpen );
  }

  getSettings() {
    return this.getState().toJS();
  }

  isRoomStarred({ id }) {
    return this.getValue("starred.rooms").includes(id);
  }

  isMessageStarred({ id }) {
    return this.getValue("starred.messages").includes(id);
  }

  getValue(key) {
    return this.getState().getIn(key.split("."));
  }
}

const instance = new UserSettingsStore(Dispatcher);
export default instance;
