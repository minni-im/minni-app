import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import Storage from "../libs/Storage";

import { ActionTypes } from "../Constants";

const STORAGE_KEY = "composerText";

function handleComposeTextSave(state, { roomId, text }) {
  if (!text || text.length === 0) {
    state = state.delete(roomId);
  } else {
    state = state.set(roomId, text);
  }
  Storage.set(STORAGE_KEY, state.toJS());
  return state;
}

class ComposerStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.COMPOSER_TEXT_SAVE, handleComposeTextSave);
  }

  getInitialState() {
    return Immutable.fromJS(Storage.get(STORAGE_KEY) || {});
  }

  getSavedText(roomId) {
    return this.get(roomId, "");
  }
}

export default new ComposerStore(Dispatcher);
