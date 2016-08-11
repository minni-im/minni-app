import Immutable from "immutable";
import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

import MessageStore from "./MessageStore";
import RoomStore from "./RoomStore";

// We are using a Record here instead of a simple Map to benefit from the
// automagic getters
const StateRecord = Immutable.Record({
  loadingMore: false,
  hasMore: true,
  ready: false
});

function updateState(loadingMore = false, hasMore = true, ready = false) {
  return new StateRecord({
    loadingMore, hasMore, ready
  });
}

function handleLoadMessages(state, { roomId }) {
  const { ready, hasMore } = state.get(roomId, new StateRecord());
  return state.set(roomId, updateState(true, hasMore, ready));
}

function handleLoadMessagesSuccess(state, { roomId, messages, limit }) {
  return state.set(roomId, updateState(false, messages.length === limit, true));
}

function handleLoadMessagesFailure(state, { roomId }) {
  const { ready, hasMore } = state.get(roomId, new StateRecord());
  return state.set(roomId, updateState(false, hasMore, ready));
}

function handleConnectionOpen(state, { rooms }) {
  return state.withMutations(map => {
    rooms.forEach(({ id }) => {
      map.set(id, new StateRecord());
    });
  });
}

function handleRoomJoin(state, { roomSlug }) {
  const { id } = RoomStore.getRoom(roomSlug);
  return state.set(id, updateState(true));
}

function handleResetHasMore(state, { roomId, scrollTop }) {
  if (scrollTop === undefined) {
    const { ready, loadingMore } = state.get(roomId, new StateRecord());
    return state.set(roomId, updateState(loadingMore, true, ready));
  }
  return state;
}


class MessageStateStore extends MapStore {
  initialize() {
    this.waitFor(MessageStore);
    this.addAction(ActionTypes.LOAD_MESSAGES, handleLoadMessages);
    this.addAction(ActionTypes.LOAD_MESSAGES_SUCCESS, handleLoadMessagesSuccess);
    this.addAction(ActionTypes.LOAD_MESSAGES_FAILURE, handleLoadMessagesFailure);

    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.ROOM_JOIN, handleRoomJoin);
    this.addAction(ActionTypes.UPDATE_DIMENSIONS, handleResetHasMore);
  }

  getMeta(roomId) {
    return this.get(roomId);
  }
}

export default new MessageStateStore(Dispatcher);
