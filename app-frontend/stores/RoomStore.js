import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import Room from "../models/Room";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomStore");

class RoomStore extends MapStore {
  reduce(state, action) {
    switch (action.type) {
      case "rooms/add":
        return addRooms(state, action.rooms);

      case "room/add":
        return addRoom(state, action.room);

      case "room/star":
        return state.setIn([action.roomId, "starred"], true);

      case "room/unstar":
          return state.setIn([action.roomId, "starred"], false);

      case "room/join":
        action.roomSlugs.forEach(roomSlug => {
          state = state.setIn([roomSlug, "connected"], true);
        });
        return state;

      case "room/leave":
        return state.setIn([action.roomSlug, "connected"], false);

      case "account/select":
        this.getDispatcher().waitFor([SelectedAccountStore.getDispatchToken()]);
        return state.map(room => room.set("active", action.account.id === room.accountId));

      default:
        return state;
    }
  }

  getCurrentRooms() {
    return this.getState().filter(room => room.active);
  }

  getRooms(roomSlugs) {
    let rooms = this.getState().filter(room => {
      return roomSlugs.indexOf(room.slug) !== -1;
    });
    return rooms;
  }
}

function addRoom(state, payload) {
  const account = SelectedAccountStore.getAccount();
  const user = UserStore.getConnectedUser();

  Object.assign(payload, {
    starred: user.settings.isRoomStarred(payload.id)
  });
  if (account) {
    Object.assign(payload, {
      active: payload.accountId === account.id
    });
  }

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
