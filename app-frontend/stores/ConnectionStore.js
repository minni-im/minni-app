import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch } from "../Dispatcher";

import { ActionTypes, SOCKETIO_OPTIONS, USER_STATUS } from "../Constants";

import * as AccountActionCreators from "../actions/AccountActionCreators";
import * as ActivityActionCreators from "../actions/ActivityActionCreators";
import * as RoomActionCreators from "../actions/RoomActionCreators";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

const socket = window.io.connect("/", SOCKETIO_OPTIONS);

function handleConnectionstart() {
  socket.emit("connect-me", {
    connectedRooms: ConnectedRoomStore.getAllIds()
  });
}

function handleConnectionOpen(state) {
  ActivityActionCreators.setStatus(USER_STATUS.CONNECTING);
  const appHolder = document.querySelector("#splashscreen");
  setTimeout(() => {
    document.body.classList.add("loaded");
    setTimeout(() => {
      appHolder.classList.add("splashscreen--hidden");
    }, 500);
  }, 1500);
  return state.add(true);
}

function handleRoomJoin({ accountSlug, roomSlug }) {
  const accountId = AccountStore.getAccount(accountSlug).id;
  const roomId = RoomStore.getRoom(roomSlug).id;
  socket.emit("rooms:join", { accountId, roomId });
}

function handleRoomLeave({ accountSlug, roomSlug }) {
  const accountId = AccountStore.getAccount(accountSlug).id;
  const roomId = RoomStore.getRoom(roomSlug).id;
  socket.emit("rooms:leave", { accountId, roomId });
}

function handleUserStatus({ status, oldStatus }) {
  if (status !== oldStatus) {
    const user = UserStore.getConnectedUser();
    if (!user) {
      // TODO: Investigate why we could be here this early ?? (meaning w/o user)
      return;
    }
    const accountIds = AccountStore.getAccounts()
      .toArray().map(account => account.id);
    socket.emit("users:presence", { userId: user.id, status, accountIds });
  }
}

function handleConnectionLost(state) {
  return state.clear().add(false);
}

socket.on("connect", () => {
  dispatch({
    type: ActionTypes.CONNECTION_START
  });
});

socket.on("connected", ({ user, accounts, rooms, users, presence }) => {
  dispatch({
    type: ActionTypes.CONNECTION_OPEN,
    user,
    accounts,
    rooms,
    users
  });

  presence.forEach(({ userId, status }) => ActivityActionCreators.updateStatus(userId, status));

  // TODO: Maybe this call could be performed on the server.
  ActivityActionCreators.updateStatus(user.id, USER_STATUS.ONLINE);
});

socket.on("disconnect", () => {
  const userId = UserStore.getConnectedUser().id;
  ActivityActionCreators.updateStatus(userId, USER_STATUS.OFFLINE);
});

socket.on("reconnecting", () => {
  const userId = UserStore.getConnectedUser().id;
  ActivityActionCreators.updateStatus(userId, USER_STATUS.CONNECTING);
});

socket.on("reconnect", () => {
  ActivityActionCreators.setStatus(USER_STATUS.ONLINE);
});

socket.on("messages:create", (message) => {
  const { id: userId } = UserStore.getConnectedUser();
  if (userId !== message.userId) {
    RoomActionCreators.receiveMessage(message.roomId, message);
  }
});

socket.on("messages:update", (message) => {
  RoomActionCreators.updateMessage(message.roomId, message);
});

socket.on("users:join", ({ user, roomId }) => {
  // TODO: Should append a system message to the given room
});

socket.on("users:disconnect", ({ user }) => {
  ActivityActionCreators.updateStatus(user.id, USER_STATUS.OFFLINE);
});

socket.on("users:typing", ({ roomId, userId }) => {
  dispatch({
    type: ActionTypes.TYPING_START,
    roomId,
    userId
  });
});

socket.on("users:presence", ({ userId, status }) => {
  ActivityActionCreators.updateStatus(userId, status);
});

socket.on("room:create", ({ room }) => {
  AccountActionCreators.receiveRoom(room);
});

socket.on("room:delete", ({ room }) => {
  RoomActionCreators.roomDeleted(room);
});

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.CONNECTION_START, withNoMutations(handleConnectionstart));
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.CONNECTION_LOST, handleConnectionLost);

    this.addAction(ActionTypes.ROOM_JOIN, withNoMutations(handleRoomJoin));
    this.addAction(ActionTypes.ROOM_LEAVE, withNoMutations(handleRoomLeave));

    this.addAction(ActionTypes.SET_USER_STATUS, withNoMutations(handleUserStatus));
  }

  isConnected() {
    return this.getState().last();
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
