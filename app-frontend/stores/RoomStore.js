import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

import Room from "../models/Room";

class RoomStore extends MapStore {
  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case "room/add":
        return addRoom(state, action.payload);
      default:
        return state;
    }
  }
}

function addRoom(state, payload) {
  let room = new Room(payload);
  return state.set(room.id, room);
}

const instance = new RoomStore(Dispatcher);
export default instance;
