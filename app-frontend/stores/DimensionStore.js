import Immutable from "immutable";

import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";

function handleScroll(state, { roomId, scrollTop, scrollHeight }) {
  if (scrollTop === undefined) {
    return state.delete(roomId);
  }
  return state.set(roomId, { scrollTop, scrollHeight });
}

class DimensionStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.UPDATE_DIMENSIONS, handleScroll);
  }

  getDimensions(room) {
    return this.getState().get(room.id, null);
  }
}

const instance = new DimensionStore(Dispatcher);
export default instance;
