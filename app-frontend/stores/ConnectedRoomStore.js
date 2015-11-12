import Immutable from "immutable";
import { MapStore, withNoMutations } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import SelectedAccountStore from "./SelectedAccountStore";
import RoomStore from "./RoomStore";

import Storage from "../libs/Storage";

import RoomActionCreators from "../actions/RoomActionCreators";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectedRoomStore");

const CONNECTED_ROOMS = "connectedRooms";

function handleNewAccount(state, { account }) {
  return state.set(account, Immutable.Set());
}

function handleRoomJoin(state, { accountSlug, roomSlug }) {
  roomSlug = [].concat(roomSlug);
  state = state.update(accountSlug, Immutable.Map(), map => {
    roomSlug.forEach(slug => {
      map = map.set(slug, true);
    });
    return map;
  });
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleRoomLeave(state, { accountSlug, roomSlug }) {
  logger.warn("handleRoomLeave", accountSlug, roomSlug);
  let connectedRooms = state.get(accountSlug);
  state = state.set(accountSlug, connectedRooms.remove(roomSlug));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleConnectionOpen(state) {
  if (state.size === 0) {
    return state;
  }
  state.forEach((slugs, accountSlug) => {
    // TODO: Should not use timeout here. Should make sure to have proper init events called in the right order.
    setTimeout(() => {
      RoomActionCreators.joinRoom(accountSlug, slugs.keySeq().toJS());
    }, 500);
  });
  return state;
}

class ConnectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, SelectedAccountStore, RoomStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleNewAccount);

    this.addAction(ActionTypes.ROOM_JOIN, handleRoomJoin);
    this.addAction(ActionTypes.ROOM_LEAVE, handleRoomLeave);

    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
  }

  getInitialState() {
    let list = Storage.get(CONNECTED_ROOMS);
    if (!list) { return Immutable.Map(); }
    return Immutable.fromJS(list).map(rooms => rooms.map(roomIdState => false));
  }

  isRoomConnected(accountSlug, roomSlug) {
    const accountRooms = this.get(accountSlug);
    if (!accountRooms) { return false; }
    return this.get(accountSlug).get(roomSlug, false);
  }

  getRooms(accountSlug) {
    const roomSlugs = this.get(accountSlug) || Immutable.Map();
    return RoomStore.getRooms(...roomSlugs.keySeq().toJS());
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
