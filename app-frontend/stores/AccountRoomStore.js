import Dispatcher from "../Dispatcher";
import Immutable from "immutable";

import { MapStore } from "../libs/Flux";
import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";

function syncFromRoomChange(state) {
  return state.withMutations(map => {
    RoomStore.getState().forEach(room => {
      map.update(room.accountId, Immutable.Set(), (list) => list.add(room));
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
