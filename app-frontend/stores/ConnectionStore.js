import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch, dispatchAsync } from "../Dispatcher";

import {
  ActionTypes,
  SOCKETIO_OPTIONS,
  USER_STATUS,
  DECONNECTION_SPAM_TRESHOLD
} from "../Constants";

import * as AccountActionCreators from "../actions/AccountActionCreators";
import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import * as RoomActionCreators from "../actions/RoomActionCreators";
import * as UserActionCreators from "../actions/UserActionCreators";
import * as NotificationsActionCreators from "../actions/NotificationsActionCreators";

import Room from "../models/Room";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

let socket = false;
let reconnection = false;

let joinLeaveNotifications = {};

const handlers = {
  connect() {
    dispatch({
      type: ActionTypes.CONNECTION_START,
    });
    socket.emit("connect-me", {
      connectedRooms: ConnectedRoomStore.getAllIds(),
      reconnection,
    });
  },

  connected({ user, accounts, rooms, users, presence }) {
    dispatch({
      type: ActionTypes.CONNECTION_OPEN,
      user,
      accounts,
      rooms,
      users,
      presence,
    });
    if (reconnection) {
      dispatch({
        type: ActionTypes.RECONNECTION,
      });
      reconnection = false;
    }
  },

  disconnect() {
    const userId = UserStore.getConnectedUser().id;
    ActivityActionCreators.updateStatus(userId, USER_STATUS.OFFLINE);
    dispatch({
      type: ActionTypes.CONNECTION_LOST,
    });
    NotificationsActionCreators.notifyFatal(
      "We are facing some difficulties. Sounds like your connection is a bit flaky"
    );
  },

  reconnecting(attempt) {
    const userId = UserStore.getConnectedUser().id;
    const ms = SOCKETIO_OPTIONS.reconnectionDelay * Math.pow(2, attempt);
    ActivityActionCreators.updateStatus(userId, USER_STATUS.CONNECTING);
    NotificationsActionCreators.notifyError(
      `We are trying hard to reconnect to the server. #${attempt} attempt ...`,
      ms
    );
  },

  reconnect() {
    NotificationsActionCreators.dismissAll();
    ActivityActionCreators.setStatus(USER_STATUS.ONLINE);
    NotificationsActionCreators.notifyInfo(
      "And we are back in the game. Connection seems ok!",
      5000
    );
    reconnection = true;
  },

  reconnect_failed() {
    logger.error("Failed to reconnect. Refresh the page.");
    NotificationsActionCreators.dismissAll();
    ActivityActionCreators.setStatus(USER_STATUS.OFFLINE);
    NotificationsActionCreators.notifyFatal(
      `All reconnection attempts have failed.
      Please refresh you browser`
    );
  },

  account: {
    join({ user, account }) {
      UserActionCreators.receiveUser(account.id, user);
    },
  },

  messages: {
    create(message) {
      const { id: userId } = UserStore.getConnectedUser();
      if (userId !== message.userId) {
        RoomActionCreators.receiveMessage(message.roomId, message);
      }
    },
    update(message, edit = false) {
      if (edit !== true) {
        RoomActionCreators.updateMessage(message.roomId, message);
      }
    },
  },

  users: {
    connect({ user }) {},

    join({ user, roomId }) {
      const timeoutId = (joinLeaveNotifications[roomId] || {})[user.id];
      if (timeoutId) {
        clearTimeout(timeoutId);
        return;
      }
      RoomActionCreators.notifyUserJoin(roomId, user.id);
    },

    leave({ user, roomId }) {
      joinLeaveNotifications = Object.assign(joinLeaveNotifications, {
        [roomId]: Object.assign({}, joinLeaveNotifications[roomId], {
          [user.id]: setTimeout(() => {
            delete joinLeaveNotifications[roomId][user.id];
            RoomActionCreators.notifyUserLeave(roomId, user.id);
          }, DECONNECTION_SPAM_TRESHOLD),
        }),
      });
    },

    disconnect({ user }) {
      ActivityActionCreators.updateStatus(user.id, USER_STATUS.OFFLINE);
    },

    typing({ roomId, userId }) {
      dispatch({
        type: ActionTypes.TYPING_START,
        roomId,
        userId,
      });
    },

    presence({ userId, status }) {
      if (userId !== UserStore.getConnectedUser().id) {
        ActivityActionCreators.updateStatus(userId, status);
      }
    },

    update(user) {
      UserActionCreators.receiveUpdateProfile(user);
    },
  },

  room: {
    create({ room }) {
      const me = UserStore.getConnectedUser();
      if (Room.isAccessGranted(room, me.id) && room.adminId !== me.id) {
        const admin = UserStore.get(room.adminId);
        AccountActionCreators.receiveRoom(room);
        NotificationsActionCreators.notify(
          `${admin.fullname} just created a new room: '${room.name}'`,
          7500
        );
      }
    },

    delete({ room }) {
      RoomActionCreators.roomDeleted(room);
    },
  },
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

function handleConnectionOpen() {
  // ActivityActionCreators.setStatus(USER_STATUS.CONNECTING);
  return true;
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
    const accountIds = AccountStore.getAccounts().toArray().map(account => account.id);
    socket.emit("users:presence", { userId: user.id, status, accountIds });
  }
}

function handleConnectionLost() {
  return false;
}

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.SESSION_START, withNoMutations(handleSessionStart));
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.CONNECTION_LOST, handleConnectionLost);

    this.addAction(ActionTypes.ROOM_JOIN, withNoMutations(handleRoomJoin));
    this.addAction(ActionTypes.ROOM_LEAVE, withNoMutations(handleRoomLeave));

    this.addAction(ActionTypes.SET_USER_STATUS, withNoMutations(handleUserStatus));
  }

  getInitialState() {
    return false;
  }

  isConnected() {
    return this.getState();
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
