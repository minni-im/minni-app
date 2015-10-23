import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../dispatchers/Dispatcher";
import Room from "../models/Room";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomStore");

function handleAccountSelect(state, { accountSlug }) {
  // if (SelectedAccountStore.getAccountSlug() === accountSlug) {
  //   return state;
  // }
  logger.info(`account '${accountSlug}' selected, recomputing active rooms`);
  const account = SelectedAccountStore.getAccount();
  return state.map(room => room.set("active", account.id === room.accountId));
}

function handleLoadRoomsSuccess(state, { rooms }) {
  const account = SelectedAccountStore.getAccount();
  const user = UserStore.getConnectedUser();
  logger.info(rooms.length, `new room(s)`);
  return state.withMutations(map => {
    rooms.forEach(room => {

      Object.assign(room, {
        starred: user.settings.isRoomStarred(room.id)
      });
      if (account) {
        Object.assign(room, {
          active: room.accountId === account.id
        });
      }
      map.set(room.id, new Room(room));
    });
  });
}

function handleRoomFavorite(state, { type, roomId }) {
  const starred = ActionTypes.ROOM_STAR === type;
  logger.info(`${starred ? "Starring" : "Unstarring"} room '${roomId}'`);
  return state.setIn([roomId, "starred"], starred);
}

function handleRoomFavoriteFailure(state, { message }) {
  logger.error(message);
  return handleRoomFavorite(...arguments);
}

class RoomStore extends MapStore {
  initialize() {
    this.waitFor(SelectedAccountStore);
    this.addAction(ActionTypes.ACCOUNT_SELECT, handleAccountSelect);
    this.addAction(ActionTypes.LOAD_ROOMS_SUCCESS, handleLoadRoomsSuccess);
    this.addAction(ActionTypes.ROOM_STAR,
      ActionTypes.ROOM_UNSTAR, handleRoomFavorite);
    this.addAction(ActionTypes.ROOM_STAR_FAILURE,
      ActionTypes.ROOM_UNSTAR_FAILURE, handleRoomFavoriteFailure);
  }

  getCurrentRooms() {
    return this.getState().filter(room => room.active);
  }

  getRooms(...roomSlugs) {
    let rooms = this.getState().filter(room => {
      return roomSlugs.indexOf(room.slug) !== -1;
    });
    return rooms;
  }
}

const instance = new RoomStore(Dispatcher);
export default instance;
