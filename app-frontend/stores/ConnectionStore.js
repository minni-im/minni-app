import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch } from "../Dispatcher";

import { ActionTypes, SOCKETIO_OPTIONS, USER_STATUS } from "../Constants";

import * as AccountActionCreators from "../actions/AccountActionCreators";
import * as ActivityActionCreators from "../actions/ActivityActionCreators";
import * as RoomActionCreators from "../actions/RoomActionCreators";
import * as UserActionCreators from "../actions/UserActionCreators";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

let socket = false;

const handlers = {
  connect() {
    dispatch({
      type: ActionTypes.CONNECTION_START
    });
  },
  connected({ user, accounts, rooms, users, presence }) {
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
  },
  disconnect() {
    const userId = UserStore.getConnectedUser().id;
    ActivityActionCreators.updateStatus(userId, USER_STATUS.OFFLINE);
  },
  reconnecting() {
    const userId = UserStore.getConnectedUser().id;
    ActivityActionCreators.updateStatus(userId, USER_STATUS.CONNECTING);
  },
  reconnect() {
    ActivityActionCreators.setStatus(USER_STATUS.ONLINE);
  },

  account: {
    join({ user, account }) {
      UserActionCreators.receiveUser(account.id, user);
    }
  },

  messages: {
    create(message) {
      const { id: userId } = UserStore.getConnectedUser();
      if (userId !== message.userId) {
        RoomActionCreators.receiveMessage(message.roomId, message);
      }
    },
    update(message) {
      RoomActionCreators.updateMessage(message.roomId, message);
    }
  },

  users: {
    connect({ user }) {

    },

    join({ user }) {
      // TODO: Should append a system message to the given room
    },

    disconnect({ user }) {
      ActivityActionCreators.updateStatus(user.id, USER_STATUS.OFFLINE);
    },

    typing({ roomId, userId }) {
      dispatch({
        type: ActionTypes.TYPING_START,
        roomId,
        userId
      });
    },

    presence({ userId, status }) {
      ActivityActionCreators.updateStatus(userId, status);
    }
  },

  room: {
    create({ room }) {
      AccountActionCreators.receiveRoom(room);
    },

    delete({ room }) {
      RoomActionCreators.roomDeleted(room);
    }
  }
};

function applyHandlers(socketObject, socketHandlers, prefix = "") {
  Object.keys(socketHandlers).forEach((event) => {
    const handler = socketHandlers[event];
    if (typeof handler === "object") {
      applyHandlers(socketObject, handler, `${event}:`);
      return;
    }
    socketObject.on(`${prefix}${event}`, socketHandlers[event]);
  });
}

function handleSessionStart() {
  if (socket === false) {
    socket = window.io.connect("/", SOCKETIO_OPTIONS);
    applyHandlers(socket, handlers);
  }
}

function handleConnectionstart() {
  socket.emit("connect-me", {
    connectedRooms: ConnectedRoomStore.getAllIds()
  });
}

function handleConnectionOpen(state) {
  ActivityActionCreators.setStatus(USER_STATUS.CONNECTING);
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

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.SESSION_START, withNoMutations(handleSessionStart));
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
