import Immutable from "immutable";
import Dispatcher, { dispatch } from "../dispatchers/Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes, TYPING_TIMEOUT } from "../Constants";

function willBeCleared(roomId, userId) {
  return setTimeout(() => {
    dispatch({
      type: ActionTypes.TYPING_STOP,
      roomId,
      userId
    });
  }, TYPING_TIMEOUT);
}

function handleTypingStart(state, { roomId, userId }) {
  const typingUsers = this.getTypingUsers(roomId);
  clearTimeout(typingUsers.get(userId));
  return state.set(roomId, typingUsers.set(userId, willBeCleared(roomId, userId)));
}

function handleTypingStop(state, { roomId, userId }) {
  const typingUsers = this.getTypingUsers(roomId);
  clearTimeout(typingUsers.get(userId));
  return state.set(roomId, typingUsers.remove(userId));
}

function handleMessageCreate(state, { roomId, message: { userId } }) {
  return handleTypingStop.call(this, state, { roomId, userId });
}

class TypingStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.TYPING_START, handleTypingStart);
    this.addAction(ActionTypes.TYPING_STOP, handleTypingStop);
    this.onAction(ActionTypes.MESSAGE_CREATE, handleMessageCreate);
  }

  getTypingUsers(roomId) {
    return this.getState().get(roomId, Immutable.OrderedMap());
  }
}

const instance = new TypingStore(Dispatcher);
export default instance;
