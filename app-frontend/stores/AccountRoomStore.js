import Dispatcher from "../Dispatcher";
import Immutable from "immutable";

import { MapStore } from "../libs/Flux";
import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountRoomStore");

function syncFromRoomChange(state) {
  return state.withMutations(map => {
    RoomStore.getState().forEach(room => {
      map.update(room.accountId, Immutable.Set(), (list) => {
        return list.add(room);
      });
    });
  });
}

class AccountRoomStore extends MapStore {
  initialize() {
    this.syncWith([AccountStore, RoomStore], syncFromRoomChange);
  }

  getRooms(accountId) {
    return this.getState().get(accountId, Immutable.Set());
  }

  getRoomsSlug(accountId) {
    return this.getRooms(accountId).map(room => room.slug);
  }
}

const instance = new AccountRoomStore(Dispatcher);
export default instance;
