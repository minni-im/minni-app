import Immutable from "immutable";
import { MapStore } from "../libs/flux/Store";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import AccountStore from "./AccountStore";
import SelectedAccountStore from "./SelectedAccountStore";
import RoomStore from "./RoomStore";

import Storage from "../libs/Storage";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectedRoomStore");

const CONNECTED_ROOMS = "connectedRooms";

function handleNewAccount(state, { account }) {
  return state.set(account, Immutable.Set());
}

function handleRoomJoin(state, { accountSlug, roomSlugs }) {
  let connectedRooms = state.get(accountSlug) || Immutable.Set();
  state = state.set(accountSlug, roomSlugs.reduce((set, roomSlug) => {
    return set.add(roomSlug);
  }, connectedRooms));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleRoomLeave(state, { accountSlug, roomId }) {
  let connectedRooms = state.get(accountSlug);
  state = state.setIn(accountSlug, connectedRooms.remove(roomId));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleLoadFromStorage(state) {
  let list = Storage.get(CONNECTED_ROOMS);
  if (!list) {
    return state;
  }
  logger.info("Some connected rooms to load", JSON.stringify(list));
  Object.keys(list).forEach(accountSlug => {
    state = handleRoomJoin(state, { accountSlug, roomSlugs: list[accountSlug] });
  });
  return state;
}

class ConnectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, SelectedAccountStore, RoomStore);
    this.addAction("account/new", handleNewAccount);
    this.addAction("room/join", handleRoomJoin);
    this.addAction("room/leave", handleRoomLeave);
    this.addAction("connectedrooms/load", handleLoadFromStorage);

    logger.info("Looking to localStorage for connected rooms");
    dispatch({
      type: "connectedrooms/load"
    });
  }

  getRooms(accountSlug) {
    const roomSlugs = this.get(accountSlug) || Immutable.Set();
    return RoomStore.getRooms(roomSlugs.toJS());
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
