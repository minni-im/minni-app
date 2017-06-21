import Immutable from "immutable";
import { MapStore } from "../libs/Flux";
import Dispatcher from "../Dispatcher";
import { ActionTypes, MESSAGE_TYPES } from "../Constants";

import AccountStore from "./AccountStore";
import ConnectionStore from "./ConnectionStore";
import FocusStore from "./FocusStore";
import UserStore from "./UserStore";
import MessageStore from "./MessageStore";
import RoomStore from "./RoomStore";
import SelectedRoomStore from "./SelectedRoomStore";

function handleConnectionOpen(state, { accounts }) {
  return state.withMutations((map) => {
    accounts.forEach((account) => {
      map.set(account.id, Immutable.Map());
    });
  });
}

function handleLoadRoomsSuccess(state, { rooms }) {
  return state.withMutations((map) => {
    rooms.forEach((room) => {
      map.set(room.accountId, Immutable.Map());
    });
  });
}

function handleMessageCreate(state, { roomId, message }) {
  const connectedUser = UserStore.getConnectedUser();
  const room = RoomStore.get(roomId);
  const accountId = room.accountId;
  const accountState = state.get(accountId, Immutable.Map());
  let roomState = accountState.get(roomId, Immutable.Map());

  roomState = roomState.withMutations((map) => {
    if (message.type !== MESSAGE_TYPES.SYSTEM_MESSAGE) {
      const roomSlugs = SelectedRoomStore.getRooms();
      if (
        !FocusStore.isWindowFocused() ||
        (FocusStore.isWindowFocused() && !roomSlugs.includes(room.slug))
      ) {
        map.set("unreadCount", map.get("unreadCount", 0) + 1);
      } else if (message.user.id === connectedUser.id) {
        map.set("unreadCount", 0);
      }
    }
    map.set("lastMessageId", message.id);
  });
  return state.set(accountId, accountState.set(roomId, roomState));
}

function handleRoomSelect(state, { roomSlug }) {
  // TODO: this is super ugly. should be done differently
  if (!ConnectionStore.isConnected()) {
    return state;
  }
  const room = RoomStore.getRoom(...roomSlug);
  const roomId = room.id;
  const accountId = room.accountId;
  const accountState = state.get(accountId, Immutable.Map());
  const roomState = accountState.get(roomId, Immutable.Map());
  return state.set(accountId, accountState.set(roomId, roomState.set("unreadCount", 0)));
}

function handleWindowFocus(state, { focused }) {
  if (focused) {
    const roomSlugs = SelectedRoomStore.getRooms();
    if (roomSlugs.size === 0) {
      return state;
    }
    const rooms = RoomStore.getRooms(...roomSlugs);
    const accountId = rooms.first().accountId;
    const accountState = state.get(accountId, Immutable.Map()).withMutations((accountMap) => {
      rooms.forEach((room) => {
        accountMap.set(room.id, accountMap.get(room.id, Immutable.Map()).set("unreadCount", 0));
      });
    });
    return state.set(accountId, accountState);
  }
  return state;
}

class UnreadMessageStore extends MapStore {
  initialize() {
    this.waitFor(FocusStore, UserStore, AccountStore, RoomStore, MessageStore);
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.LOAD_ROOMS_SUCCESS, handleLoadRoomsSuccess);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleMessageCreate);
    this.addAction(ActionTypes.ROOM_SELECT, handleRoomSelect);
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
  }

  getUnreadCount(accountId, roomId) {
    return this.getState()
      .get(accountId, Immutable.Map())
      .get(roomId, Immutable.Map())
      .get("unreadCount", 0);
  }

  getTotalUnreadCount(accountId) {
    if (accountId) {
      return this.getState().get(accountId, Immutable.Map()).reduce((sum, roomState) => {
        sum += roomState.get("unreadCount", 0);
        return sum;
      }, 0);
    }
    return this.getState().reduce(
      (sum, account) => account.reduce((subSum, room) => subSum + room.get("unreadCount", 0), sum),
      0
    );
  }
}

const instance = new UnreadMessageStore(Dispatcher);
export default instance;
