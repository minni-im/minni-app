import Immutable from "immutable";
import { MapStore, withNoMutations } from "../libs/Flux";

import Dispatcher from "../Dispatcher";
import { dispatch } from "../Dispatcher";

import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";

import SelectedAccountStore from "./SelectedAccountStore";

import Storage from "../libs/Storage";

import RoomActionCreators from "../actions/RoomActionCreators";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectedRoomStore");

const CONNECTED_ROOMS = "connectedRooms";

let __connected = false;

// TODO: to be updated with ID instead of slug
function handleNewAccount(state, { account }) {
  return state.set(account, Immutable.Set());
}

function handleRoomJoin(state, { accountSlug, roomSlug }) {
  const { id: accountId } = AccountStore.getAccount(accountSlug);
  const { id: roomId } = RoomStore.getRoom(roomSlug);
  state = state.update(accountId, Immutable.Set(), map => {
    return map.add(roomId);
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

function handleConnectionOpen({accounts}) {
  __connected = true;
}

class ConnectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, SelectedAccountStore, RoomStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleNewAccount);

    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen));

    this.addAction(ActionTypes.ROOM_JOIN, handleRoomJoin);
    this.addAction(ActionTypes.ROOM_LEAVE, handleRoomLeave);
  }

  getInitialState() {
    let list = Storage.get(CONNECTED_ROOMS);
    if (!list) { return Immutable.Map(); }
    return Immutable.fromJS(list).map(i => i.toSet());
  }

  isRoomConnected(accountSlug, roomSlug) {
    if (!__connected) {
      return true;
    }
    const { id: accountId } = AccountStore.getAccount(accountSlug);
    const { id: roomId } = RoomStore.getRoom(roomSlug);
    if (accountId && roomId) {
      return this.getState().get(accountId, Immutable.Set()).has(roomId);
    }
    return false;
  }

  getRooms(accountId) {
    if (!__connected || !accountId) {
      return Immutable.Map();
    }
    const roomsId = this.getState().get(accountId, Immutable.Set()).toArray();
    return RoomStore.getRoomsById(...roomsId);
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
