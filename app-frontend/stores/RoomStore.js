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

      case "rooms/add":
        return addRooms(state, action.payload);

      default:
        return state;
    }
  }

  getForAccount(accountId) {
    return this.getState().filter(room => {
      return room.accountId === accountId;
    });
  }

  get(roomSlug) {
    return this.getState().find(room => {
      return room.slug === roomSlug;
    });
  }

  getPrivate() {
    return this.getState().filter(room => room.private);
  }

  getPublic() {
    return this.getState().filter(room => room.public);
  }
}

function addRoom(state, payload) {
  let room = new Room(payload);
  return state.set(room.id, room);
}

function addRooms(state, rooms) {
  for (let room of rooms) {
    state = addRoom(state, room);
  }
  return state;
}

const instance = new RoomStore(Dispatcher);
export default instance;
