import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";
import Room from "../models/Room";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import UserSettingsStore from "../stores/UserSettingsStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomStore");

function handleLoadRoomsSuccess(state, { rooms }) {
  logger.info(rooms.length, `new room(s)`);
  return state.withMutations(map => {
    rooms.forEach(room => {
      Object.assign(room, {
        starred: UserSettingsStore.isRoomStarred(room)
      });
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
    this.addAction(ActionTypes.LOAD_ROOMS_SUCCESS,
      ActionTypes.CONNECTION_OPEN, handleLoadRoomsSuccess);

    this.addAction(ActionTypes.ROOM_STAR,
      ActionTypes.ROOM_UNSTAR, handleRoomFavorite);
    this.addAction(ActionTypes.ROOM_STAR_FAILURE,
      ActionTypes.ROOM_UNSTAR_FAILURE, handleRoomFavoriteFailure);
  }

  get(roomId) {
    return this.getState().get(roomId);
  }

  getRoom(roomSlug) {
    return this.getRooms(roomSlug).first();
  }

  getRooms(...roomSlugs) {
    let rooms = this.getState().filter(room => {
      return roomSlugs.indexOf(room.slug) !== -1;
    });
    return rooms;
  }

  getRoomsById(...ids) {
    return this.getState().filter(room => ids.indexOf(room.id) !== -1);
  }
}

const instance = new RoomStore(Dispatcher);
export default instance;
