import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";
import Dispatcher from "../Dispatcher";

import RoomStore from "../stores/RoomStore";

// We are using a Record here instead of a simple Map to benefit from the
// automagic getters (record.scrollTop instead of recordFromMap.get('scrollTop'))
const DimensionRecord = Immutable.Record({
  scrollTop: null,
  scrollHeight: null
});

function handleScroll(state, { roomId, scrollTop, scrollHeight }) {
  if (scrollTop === undefined) {
    return state.delete(roomId);
  }
  return state.set(roomId, new DimensionRecord({
    scrollTop, scrollHeight
  }));
}

function handleRoomLeave(state, { roomSlug }) {
  const { id } = RoomStore.getRoom(roomSlug);
  return state.delete(id);
}

class DimensionStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.UPDATE_DIMENSIONS, handleScroll);
    this.addAction(ActionTypes.ROOM_LEAVE, handleRoomLeave);
  }

  getDimensions(room) {
    return this.getState().get(room.id, null);
  }
}

const instance = new DimensionStore(Dispatcher);
export default instance;
