import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";
import AccountRoomStore from "./AccountRoomStore";
import SelectedAccountStore from "./SelectedAccountStore";

import Logger from "../libs/Logger";
const logger = Logger.create("SelectedRoomStore");

import { slugify } from "../utils/TextUtils";

function handleRoomSelect(state, { accountSlug, roomSlug }) {
  const account = SelectedAccountStore.getAccount();
  if (account) {
    const rooms = AccountRoomStore.getRoomsSlug(account.id);
    return state.set(accountSlug, rooms.intersect(roomSlug));
  } else {
    return state.set(accountSlug, Immutable.Set(roomSlug));
  }
}

function handleRoomsDeselect(state, { accountSlug, roomSlugs }) {
  return state.update(accountSlug, Immutable.Set(), (slugs) => {
    return slugs.subtract(roomSlugs);
  });
}

function handleAccountNew(state, { account }) {
  return state.set(account, Immutable.Set());
}

class SelectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, RoomStore, SelectedAccountStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleAccountNew);
    this.addAction(ActionTypes.ROOM_SELECT, handleRoomSelect);
    this.addAction(ActionTypes.ROOMS_DESELECT, handleRoomsDeselect);
  }

  getRooms(accountSlug = SelectedAccountStore.getAccountSlug()) {
    return this.getState().get(accountSlug, Immutable.Set());
  }
}

export default new SelectedRoomStore(Dispatcher);
