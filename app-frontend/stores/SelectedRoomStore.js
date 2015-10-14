import Immutable from "immutable";
import { ReduceStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

import AccountStore from "./AccountStore";
import RoomStore from "./RoomStore";
import SelectedAccountStore from "./SelectedAccountStore";


function getRoomId(roomSlugs) {
  const rooms = RoomStore.getRooms()
    .toSeq()
    .filter(room => roomSlugs.indexOf(room.slug) !== -1);
  if (rooms != null) {
    return Immutable.Set(rooms.map(room => room.id));
  }
}


function handleRoomSelect(state, { roomSlugs }) {
  const accountId = SelectedAccountStore.getAccountId();
  const roomId = getRoomId(roomSlugs);
  state = state.setIn(accountId, roomId);
  return state;
}


class SelectedRoomStore extends ReduceStore {
  getInitialState() {
    return Immutable.Map();
  }

  reduce(state, action) {
    this.waitFor([
      AccountStore.getDispatchToken(),
      RoomStore.getDispatchToken(),
      SelectedAccountStore.getDispatchToken()
    ]);
    switch (action.type) {
      case "room/select":
        return handleRoomSelect(state, action);
      default:
        return state;
    }
  }

  getRoomId(accountId = SelectedAccountStore.getAccountId()) {
    return this.getState().get(accountId);
  }
}

export default new SelectedRoomStore(Dispatcher);
