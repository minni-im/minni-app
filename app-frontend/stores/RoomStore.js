import moment from "moment";
import { MapStore, withNoMutations } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";
import Room from "../models/Room";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import UserSettingsStore from "../stores/UserSettingsStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomStore");

function handleLoadRoomsSuccess(state, { rooms }) {
  logger.info(rooms.length, "new room(s)");
  return state.withMutations(map => {
    rooms.forEach(room => {
      Object.assign(room, {
        lastUpdated: moment(room.lastUpdated),
        dateCreated: moment(room.dateCreated),
        starred: UserSettingsStore.isRoomStarred(room),
        usersList: UserSettingsStore.isRoomConnectedUsersListActive(room)
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
  return handleRoomFavorite(state, { message });
}

function handleRoomDelete(state, { room }) {
  return state.delete(room.id);
}

function logFailure(type) {
  return ({ message }) => {
    logger.error(type, message);
  };
}

class RoomStore extends MapStore {
  initialize() {
    this.waitFor(SelectedAccountStore);
    this.addAction(
      ActionTypes.LOAD_ROOMS_SUCCESS,
      ActionTypes.CONNECTION_OPEN,
      handleLoadRoomsSuccess);
    this.addAction(
      ActionTypes.ROOM_STAR,
      ActionTypes.ROOM_UNSTAR,
      handleRoomFavorite);
    this.addAction(
      ActionTypes.ROOM_STAR_FAILURE,
      ActionTypes.ROOM_UNSTAR_FAILURE,
      handleRoomFavoriteFailure);
    this.addAction(
      ActionTypes.ROOM_CREATE_SUCCESS,
      ActionTypes.ROOM_UPDATE_SUCCESS,
      (state, { room }) => handleLoadRoomsSuccess(state, { rooms: [room] }));

    this.addAction(ActionTypes.ROOM_DELETE_SUCCESS, handleRoomDelete);
    this.addAction(ActionTypes.ROOM_DELETE_FAILURE, withNoMutations(logFailure("RoomDelete")));
    this.addAction(ActionTypes.ROOM_UPDATE_FAILURE, withNoMutations(logFailure("RoomUpdate")));
  }

  get(roomId) {
    return this.getState().get(roomId);
  }

  getRoom(roomSlug) {
    return this.getRooms(roomSlug).first();
  }

  getRooms(...roomSlugs) {
    return this.getState()
      .filter(room => roomSlugs.indexOf(room.slug) !== -1);
  }

  getRoomsBySelectedAccount(...roomSlugs) {
    const selectedAccount = SelectedAccountStore.getAccount();
    return this.getRooms(...roomSlugs)
      .filter(room => room.accountId === selectedAccount.id);
  }

  getRoomsById(...ids) {
    return this.getState().filter(room => ids.indexOf(room.id) !== -1);
  }
}

const instance = new RoomStore(Dispatcher);
export default instance;
