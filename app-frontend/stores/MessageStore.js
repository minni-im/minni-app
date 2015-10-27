import Immutable from "immutable";
import Dispatcher from "../dispatchers/Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import UserStore from "../stores/UserStore";
import RoomStore from "../stores/RoomStore";

function handleIncomingMessage(state, { roomId, message }) {
  let messages = state.get(roomId, Immutable.OrderedMap());
  const nonce = message.nonce;
  if (nonce !== null && messages.has(nonce)) {
    delete message.nonce;
    messages = messages.replace(nonce, message.id, message);
  } else {
    messages = messages.withMutations(map => {
      map.set(message.id, message);
    });
  }
  return state.set(roomId, messages);
}

class MessageStore extends MapStore {
  initialize() {
    this.waitFor(UserStore, RoomStore);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleIncomingMessage);
  }

  getMessages(roomId) {
    return this.getState().get(roomId, Immutable.OrderedMap());
  }
}

const instance = new MessageStore(Dispatcher);
export default instance;
