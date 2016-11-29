import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";

function syncFromRoomChange() {
  return RoomStore.getState()
    .groupBy(room => room.accountId);
}

class AccountRoomStore extends MapStore {
  initialize() {
    this.syncWith([AccountStore, RoomStore], syncFromRoomChange);
  }

  getRooms(accountId) {
    return this.getState()
      .get(accountId, Immutable.Set())
      .toSet()
      .sortBy(room => room.name);
  }

  getRoomsSlug(accountId) {
    return this.getRooms(accountId).map(room => room.slug);
  }
}

const instance = new AccountRoomStore(Dispatcher);
export default instance;
