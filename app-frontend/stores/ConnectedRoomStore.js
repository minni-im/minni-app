import Immutable from "immutable";
import { MapStore, withNoMutations } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import SelectedAccountStore from "./SelectedAccountStore";
import RoomStore from "./RoomStore";

import RoomActionCreators from "../actions/RoomActionCreators";

import Storage from "../libs/Storage";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectedRoomStore");

const CONNECTED_ROOMS = "connectedRooms";

function handleNewAccount(state, { account }) {
  return state.set(account, Immutable.Set());
}

function handleRoomJoin(state, { accountSlug, roomSlug }) {
  let connectedRooms = state.get(accountSlug) || Immutable.Set();
  state = state.set(accountSlug, connectedRooms.add(roomSlug));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleRoomLeave(state, { accountSlug, roomSlug }) {
  let connectedRooms = state.get(accountSlug);
  state = state.setIn(accountSlug, connectedRooms.remove(roomSlug));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function loadConnectedRoomsFromStorage() {
  let list = Storage.get(CONNECTED_ROOMS);
  if (!list) {
    return;
  }
  logger.info("Some connected rooms to load", JSON.stringify(list));
  Object.keys(list).forEach(accountSlug => RoomActionCreators.joinRoom(accountSlug, list[accountSlug]));
}

class ConnectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, SelectedAccountStore, RoomStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleNewAccount);

    this.addAction(ActionTypes.ROOM_JOIN, handleRoomJoin);
    this.addAction(ActionTypes.ROOM_LEAVE, handleRoomLeave);

    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(() => {
      setImmediate(loadConnectedRoomsFromStorage);
    }));
  }

  isRoomConnected(accountSlug, roomSlug) {
    const accountRooms = this.get(accountSlug);
    if (!accountRooms) { return false; }
    return this.get(accountSlug).has(roomSlug);
  }

  getRooms(accountSlug) {
    const roomSlugs = this.get(accountSlug) || Immutable.Set();
    return RoomStore.getRooms(...roomSlugs.toJS());
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
