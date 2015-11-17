import Immutable from "immutable";
import { MapStore } from "../libs/Flux";
import Dispatcher from "../dispatchers/Dispatcher";
import { ActionTypes } from "../Constants";

import AccountStore from "./AccountStore";
import UserStore from "./UserStore";
import MessageStore from "./MessageStore";
import RoomStore from "./RoomStore";
import SelectedRoomStore from "./SelectedRoomStore";
let __connected = false;

function handleConnectionOpen(state, { accounts }) {
  __connected = true;
  return state.withMutations(map => {
    accounts.forEach(account => {
      map.set(account.id, Immutable.Map());
    });
  });
}

function handleLoadRoomsSuccess(state, { rooms }) {
  return state.withMutations(map => {
    rooms.forEach(room => {
      map.set(room.accountId, Immutable.Map());
    });
  });
}

function handleMessageCreate(state, { roomId, message }) {
  const room = RoomStore.get(roomId);
  const currentUser = UserStore.getConnectedUser();
  const selectedRoomsSlugs = SelectedRoomStore.getRooms();

  const accountId = room.accountId;
  const accountState = state.get(accountId, Immutable.Map());
  let roomState = accountState.get(roomId, Immutable.Map());

  roomState = roomState.withMutations(map => {
    if (!selectedRoomsSlugs.has(room.slug)) {
      map.set("unreadCount", map.get("unreadCount", 0) + 1);
    }
    map.set("lastMessageId", message.id);
  });
  return state.set(accountId, accountState.set(roomId, roomState));
}

function handleRoomSelect(state, { roomSlug }) {
  // TODO: this is super ugly. should be done differently
  if (!__connected) {
    return state;
  }
  const room = RoomStore.getRoom(...roomSlug);
  const roomId = room.id, accountId = room.accountId;
  const accountState = state.get(accountId, Immutable.Map());
  const roomState = accountState.get(roomId, Immutable.Map());
  return state.set(accountId, accountState.set(roomId, roomState.set("unreadCount", 0)));
}

class UnreadMessageStore extends MapStore {
  initialize() {
    this.waitFor(UserStore, AccountStore, RoomStore, MessageStore);
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.LOAD_ROOMS_SUCCESS, handleLoadRoomsSuccess);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleMessageCreate);
    this.addAction(ActionTypes.ROOM_SELECT, handleRoomSelect);
  }

  getUnreadCount(accountId, roomId) {
    return this.getState()
      .get(accountId, Immutable.Map())
      .get(roomId, Immutable.Map())
      .get("unreadCount", 0);
  }

  getTotalUnreadCount(accountId) {
    return this.getState()
      .get(accountId, Immutable.Map())
      .reduce((sum, roomState) => {
        sum += roomState.get("unreadCount", 0);
        return sum;
      }, 0);
  }

  getTotalUnreadCount() {
    return this.getState()
      .reduce((sum, account) => {
        return account.reduce((subSum, room) => {
          return sum + room.get("unreadCount", 0);
        }, sum);
      }, 0);
  }
}

const instance = new UnreadMessageStore(Dispatcher);
export default instance;
