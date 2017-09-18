import { MapStore } from "../libs/Flux";

import Dispatcher from "../Dispatcher";
import { ActionTypes } from "../Constants";

function handleMessageEditStart(state, { roomId, messageId }) {
  return state.set(roomId, messageId);
}

function handleMessageEditStop(state, { roomId }) {
  return state.delete(roomId);
}

class EditMessageStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.MESSAGE_EDIT_START, handleMessageEditStart);
    this.addAction(ActionTypes.MESSAGE_EDIT_STOP, handleMessageEditStop);
  }

  isMessageEdited(roomId, messageId) {
    return messageId === this.getState().get(roomId);
  }

  isRoomInEditMode(roomId) {
    return this.getState().has(roomId);
  }
}

const instance = new EditMessageStore(Dispatcher);
export default instance;
