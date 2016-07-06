import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../Dispatcher";
import User from "../models/User";

import Logger from "../libs/Logger";
const logger = Logger.create("UserStore");

let connectedUserId;

function handleUsersAdd(state, { users }) {
  state = state.withMutations(map => {
    users.forEach(user => {
      map.set(user.id, new User(user));
    });
  });
  return state;
}

function handleUserAdd(state, { user }) {
  return state.set(user.id, new User(user));
}

function handleConnectionOpen(state, { user, users }) {
  connectedUserId = user.id;
  state = state.set(user.id, new User(user));
  logger.info("Registering logged in user", user.fullname);
  return handleUsersAdd(state, { users});
}

function handleProfileUpdate(state, { user }) {
  return handleUserAdd(state, { user });
}

class UserStore extends MapStore {

  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.LOAD_USER_SUCCESS, handleUserAdd);
    this.addAction(ActionTypes.LOAD_USERS_SUCCESS, handleUsersAdd);
    this.addAction(ActionTypes.PROFILE_UPDATE_SUCCESS, handleProfileUpdate);
  }

  getUsers(usersId, except = []) {
    return this.getState().filter(user => {
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

  getAll() {
    return this.getState()
      .filter(user => user.id !== connectedUserId)
      .toArray();
  }
}

const instance = new UserStore(Dispatcher);
export default instance;
