import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";
import SelectedAccountStore from "./SelectedAccountStore";

import Logger from "../libs/Logger";
const logger = Logger.create("SelectedRoomStore");

import { slugify } from "../utils/TextUtils";

function handleRoomsSelect(state, { accountSlug, roomSlugs }) {
  return state.update(accountSlug, Immutable.Set(), (slugs) => {
    return slugs.union(roomSlugs);
  });
}

function handleRoomsDeselect(state, { accountSlug, roomSlugs }) {
  return state.update(accountSlug, (slugs) => {
    return slugs.subtract(roomSlugs);
  });
}

function handleAccountNew(state, { account }) {
  return state.set(account, Immutable.Set());
}

class SelectedRoomStore extends MapStore {
  initialize() {
    this.waitFor(AccountStore, RoomStore);
    this.addAction(ActionTypes.ACCOUNT_NEW, handleAccountNew);
    this.addAction(ActionTypes.ROOM_SELECT,
      ActionTypes.ROOMS_SELECT, handleRoomsSelect);
    this.addAction(ActionTypes.ROOMS_DESELECT, handleRoomsDeselect);
  }

  getRooms(accountSlug = SelectedAccountStore.getAccountSlug()) {
    return this.getState().get(accountSlug, Immutable.Set());
  }
}

export default new SelectedRoomStore(Dispatcher);
