import Immutable from "immutable";
import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";
import MessageStore from "./MessageStore";

function handleLoadMessages(state, { roomId }) {
  return state.setIn([roomId, "loadingMore"], true);
}

function handleLoadMessagesSuccess(state, { roomId, messages, limit }) {
  return state.withMutations(map => {
    map.setIn([roomId, "loadingMore"], false);
    map.setIn([roomId, "hasMore"], messages.length === limit);
  });
}

function handleLoadMessagesFailure(state, { roomId }) {
  return state.setIn([roomId, "loadingMore"], false);
}

function handleResetHasMore(state, { roomId, scrollTop }) {
  if (scrollTop === undefined) {
    return state.setIn([roomId, "hasMore"], true);
  }
  return state;
}


class MessageStateStore extends MapStore {
  initialize() {
    this.waitFor(MessageStore);
    this.addAction(ActionTypes.LOAD_MESSAGES, handleLoadMessages);
    this.addAction(ActionTypes.LOAD_MESSAGES_SUCCESS, handleLoadMessagesSuccess);
    this.addAction(ActionTypes.LOAD_MESSAGES_FAILURE, handleLoadMessagesFailure);

    this.addAction(ActionTypes.UPDATE_DIMENSIONS, handleResetHasMore);
  }

  isLoading(roomId) {
    return this.getState()
      .get(roomId, Immutable.Map())
      .get("loadingMore", false);
  }

  hasMore(roomId) {
    return this.getState()
      .get(roomId, Immutable.Map())
      .get("hasMore", false);
  }

  getMeta(roomId) {
    return {
      loadingMore: this.isLoading(roomId),
      hasMore: this.hasMore(roomId)
    };
  }
}

export default new MessageStateStore(Dispatcher);
