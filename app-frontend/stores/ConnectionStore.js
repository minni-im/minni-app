import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch } from "../Dispatcher";

import { ActionTypes, SOCKETIO_OPTIONS, USER_STATUS } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";
import RoomActionCreators from "../actions/RoomActionCreators";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

const socket = window.io.connect("/", SOCKETIO_OPTIONS);
socket.on("connect", () => {
  dispatch({
    type: ActionTypes.CONNECTION_START
  });
});

socket.on("connected", ({ user, accounts, rooms, users }) => {
  dispatch({
    type: ActionTypes.CONNECTION_OPEN,
    user,
    accounts,
    rooms,
    users
  });
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
  logger.warn(`${user.fullname} has joined ${roomId}`);
});

socket.on("users:disconnect", ({ user, rooms }) => {
  logger.warn(`${user.fullname} disconnected`, rooms);
});

socket.on("users:typing", ({ roomId, userId }) => {
  dispatch({
    type: ActionTypes.TYPING_START,
    roomId,
    userId
  });
});

socket.on("users:status", ({ userId, status }) => {
  ActivityActionCreators.setStatus(userId, status);
});

function handleConnectionstart() {
  socket.emit("connect-me", {
    connectedRooms: ConnectedRoomStore.getState().toJS()
  });
}

function handleConnectionOpen() {
  ActivityActionCreators.setStatus(null, USER_STATUS.CONNECTING);
  const appHolder = document.querySelector("#splashscreen");
  setTimeout(() => {
    document.body.classList.add("loaded");
    setTimeout(() => {
      appHolder.classList.add("splashscreen--hidden");
    }, 500);
  }, 1500);
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

function handleUserStatus({ userId, status }) {
  if (userId) {
    return; // We only want the connected user to send his status
  }
  const user = UserStore.getConnectedUser();
  const accountIds = AccountStore.getAccounts()
    .toArray().map(account => account.id);
  socket.emit("users:status", { userId: user.id, status, accountIds });
}

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.CONNECTION_START, withNoMutations(handleConnectionstart));
    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen));

    this.addAction(ActionTypes.ROOM_JOIN, withNoMutations(handleRoomJoin));
    this.addAction(ActionTypes.ROOM_LEAVE, withNoMutations(handleRoomLeave));

    this.addAction(ActionTypes.USER_STATUS, withNoMutations(handleUserStatus));
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
