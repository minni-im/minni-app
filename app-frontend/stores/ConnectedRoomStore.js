import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import Dispatcher from "../Dispatcher";

import { ActionTypes } from "../Constants";

import * as RoomActionCreators from "../actions/RoomActionCreators";

import ConnectionStore from "./ConnectionStore";
import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";
import MessageStore from "./MessageStore";

import SelectedAccountStore from "./SelectedAccountStore";

import Storage from "../libs/Storage";
import Logger from "../libs/Logger";

const logger = Logger.create("ConnectedRoomStore");

const CONNECTED_ROOMS = "connectedRooms";

// TODO: to be updated with ID instead of slug
function handleNewAccount(state, { account }) {
  return state.set(account, Immutable.Set());
}

function handleRoomJoin(state, { accountSlug, roomSlug }) {
  const { id: accountId } = AccountStore.getAccount(accountSlug);
  const { id: roomId } = RoomStore.getRoom(roomSlug);
  state = state.update(accountId, Immutable.Set(), map => map.add(roomId));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleRoomLeave(state, { accountSlug, roomSlug }) {
  const { id: accountId } = AccountStore.getAccount(accountSlug);
  const { id: roomId } = RoomStore.getRoom(roomSlug);
  state = state.update(accountId, Immutable.Set(), map => map.remove(roomId));
  Storage.set(CONNECTED_ROOMS, state.toJS());
  return state;
}

function handleReconnection(state) {
  state.forEach((roomIds) => {
    roomIds.forEach((roomId) => {
      const lastMessage = MessageStore.getLastestMessage(roomId);
      RoomActionCreators.fetchMessages(
        roomId,
        null,
        lastMessage ? lastMessage.dateCreated.toISOString() : null,
      );
    });
  });
  return state;
}

class ConnectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(ConnectionStore, AccountStore, SelectedAccountStore, RoomStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleNewAccount);
    this.addAction(ActionTypes.ROOM_JOIN, handleRoomJoin);
    this.addAction(ActionTypes.ROOM_LEAVE, handleRoomLeave);
    this.addAction(ActionTypes.RECONNECTION, handleReconnection);
  }

  getInitialState() {
    const list = Storage.get(CONNECTED_ROOMS);
    if (!list) {
      return Immutable.Map();
    }
    return Immutable.fromJS(list).map(i => i.toSet());
  }

  isRoomConnected(accountSlug, roomSlug) {
    if (!ConnectionStore.isConnected()) {
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
    if (!ConnectionStore.isConnected() || !accountId) {
      return Immutable.Map();
    }
    const roomsId = this.getState().get(accountId, Immutable.Set()).toArray();
    return RoomStore.getRoomsById(...roomsId);
  }

  getAllIds() {
    return this.getState().toJS();
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
