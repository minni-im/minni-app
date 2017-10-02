// We import it here so it is loaded. Store has no public API and thus would never
// be loaded by a component.
import "./PresenceStore";

import { MapStore } from "../libs/Flux";
import { ActionTypes, USER_STATUS } from "../Constants";

import Dispatcher from "../Dispatcher";
import User from "../models/User";

import Logger from "../libs/Logger";

const logger = Logger.create("UserStore");

let connectedUserId;

function handleUsersAdd(state, { users }) {
  state = state.withMutations((map) => {
    users.forEach((user) => {
      map.set(user.id, new User(user));
    });
  });
  return state;
}

function handleUserAdd(state, { user }) {
  return state.set(user.id, new User(user));
}

function handleStatusUpdate(state, { userId, status }) {
  if (!userId) {
    userId = connectedUserId;
  }
  if (!state.has(userId)) {
    return state;
  }
  return state.update(userId, user => user.set("status", status));
}

function handleConnectionOpen(state, { user, users, presence }) {
  connectedUserId = user.id;
  user.status = USER_STATUS.ONLINE;
  state = state.set(user.id, new User(user));
  logger.info("Registering logged in user", user.fullname, user.id);
  state = handleUsersAdd(state, { users });

  presence.forEach(({ userId, status }) => {
    state = handleStatusUpdate(state, { userId, status });
  });
  return state;
}

function handleProfileUpdate(state, { user }) {
  return handleUserAdd(state, {
    user: {
      ...user,
      status: this.getStatus(user.id),
    },
  });
}

class UserStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.LOAD_USER_SUCCESS, handleUserAdd);
    this.addAction(ActionTypes.LOAD_USERS_SUCCESS, handleUsersAdd);
    this.addAction(ActionTypes.PROFILE_UPDATE_SUCCESS, handleProfileUpdate);

    this.addAction(ActionTypes.SET_USER_STATUS, handleStatusUpdate);
    this.addAction(ActionTypes.UPDATE_USER_STATUS, handleStatusUpdate);
  }

  getUsers(usersId = [], except = []) {
    return this.getState().filter((user) => {
      const { id } = user;
      return usersId.indexOf(id) !== -1 && except.indexOf(id) === -1;
    });
  }

  getUser(userId) {
    return this.get(userId);
  }

  getConnectedUser() {
    return this.get(connectedUserId);
  }

  getStatus(userId) {
    return this.getUser(userId).get("status", 0);
  }

  getAll() {
    return this.getState()
      .filter(user => user.id !== connectedUserId)
      .toArray();
  }
}

const instance = new UserStore(Dispatcher);
export default instance;
