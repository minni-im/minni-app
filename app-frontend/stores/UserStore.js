import { MapStore } from "../libs/flux/Store";

import Dispatcher from "../dispatchers/Dispatcher";
import User from "../models/User";

import Logger from "../libs/Logger";
const logger = Logger.create("UserStore");

function handleUsersAdd(state, { users }) {
  for (let user of users) {
    state = handleUserAdd(state, { user });
  }
  return state;
}

function handleUserAdd(state, { user }) {
  let newUser = new User(user);
  return state.set(newUser.id, newUser);
}

class UserStore extends MapStore {

  initialize() {
    this.addAction("user/add", handleUserAdd);
    this.addAction("users/add", handleUsersAdd);

    logger.info("loading connected user");
    let dataHolder = document.getElementById("data-holder");
    let user = JSON.parse(dataHolder.dataset.user);
    if (!__DEV__) {
      delete dataHolder.dataset.user;
    }

    let connectedUser = new User(user);
    this.connectedUserId = user.id;
    this._state = this._state.set(this.connectedUserId, connectedUser);
  }

  getUsers(usersId, exceptions = []) {
    return this.getState().filter(user => {
      const { id } = user;
      return usersId.indexOf(id) !== -1 && exceptions.indexOf(id) === -1;
    });
  }

  getConnectedUser() {
    return this.get(this.connectedUserId);
  }
}

const instance = new UserStore(Dispatcher);
export default instance;
