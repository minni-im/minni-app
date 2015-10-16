import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Dispatcher from "../dispatchers/Dispatcher";
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

function handleConnectionOpen(state, { user }) {
  connectedUserId = user.id;
  state = state.set(user.id, new User(user));
  logger.info("Registering logged in user", user.fullname);
  return state;
}

class UserStore extends MapStore {

  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.LOAD_USER_SUCCESS, handleUserAdd);
    this.addAction(ActionTypes.LOAD_USERS_SUCCESS, handleUsersAdd);
  }

  getUsers(usersId, exceptions = []) {
    return this.getState().filter(user => {
      const { id } = user;
      return usersId.indexOf(id) !== -1 && exceptions.indexOf(id) === -1;
    });
  }

  getConnectedUser() {
    return this.get(connectedUserId);
  }
}

const instance = new UserStore(Dispatcher);
export default instance;
