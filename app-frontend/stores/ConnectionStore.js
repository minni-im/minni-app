import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch } from "../dispatchers/Dispatcher";

import { ActionTypes, SOCKETIO_OPTIONS } from "../Constants";

import AccountActionCreators from "../actions/AccountActionCreators";
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

socket.on("users:join", ({user, roomId}) => {
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

function handleConnectionstart() {
  socket.emit("connect-me", {
    connectedRooms: ConnectedRoomStore.getState().toJS()
  });
}

function handleConnectionOpen() {
  const appHolder = document.querySelector("#minni");
  setTimeout(()=> {
    appHolder.classList.add("fadein");
  }, 1000);
}

function handleRoomJoin({accountSlug, roomSlug}) {
  const accountId = AccountStore.getAccount(accountSlug).id;
  const roomId = RoomStore.getRoom(roomSlug).id;
  socket.emit("rooms:join", { accountId, roomId });
}

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.CONNECTION_START, withNoMutations(handleConnectionstart));
    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen));

    this.addAction(ActionTypes.ROOM_JOIN, withNoMutations(handleRoomJoin));
  }

  getInitialState() {
    return new Set();
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
