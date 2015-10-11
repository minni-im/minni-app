import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import Room from "../models/Room";

import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";

class RoomStore extends MapStore {
  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case "rooms/add":
        return addRooms(state, action.payload);

      case "room/add":
        return addRoom(state, action.payload);

      case "room/star":
        return state.setIn([action.roomId, "starred"], true);

      case "room/unstar":
          return state.setIn([action.roomId, "starred"], false);

      case "room/join":
        action.roomIds.forEach(roomId => {
          state = state.setIn([roomId, "connected"], true);
        });
        return state;

      case "room/leave":
        action.roomIds.forEach(roomId => {
          state = state.setIn([roomId, "connected"], false);
        });
        return state;

      case "account/select":
        this.getDispatcher().waitFor([AccountStore.getDispatchToken()]);
        return state.map(room => room.set("active", action.account.id === room.accountId));

      default:
        return state;
    }
  }

  getCurrentRooms() {
    return this.getState().filter(room => room.active);
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
  const account = AccountStore.getCurrentAccount();
  const user = UserStore.getConnectedUser();

  Object.assign(payload, {
    active: payload.accountId === account.id,
    starred: user.settings.isRoomStarred(payload.id)
  });
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
