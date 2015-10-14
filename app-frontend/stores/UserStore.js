import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import User from "../models/User";

import Logger from "../libs/Logger";
const logger = Logger.create("UserStore");

class UserStore extends MapStore {

  getInitialState() {
    let state = Immutable.Map();

    logger.info("loading connected user");
    let dataHolder = document.getElementById("data-holder");
    let user = JSON.parse(dataHolder.dataset.user);
    if (!__DEV__) {
      delete dataHolder.dataset.user;
    }

    let connectedUser = new User(user);
    this.connectedUserId = user.id;
    state = state.set(this.connectedUserId, connectedUser);

    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case "user/add":
        return addUser(state, action.payload);

      case "users/add":
        return addUsers(state, action.payload);

      default:
        return state;
    }
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

function addUsers(state, usersPayload) {
  for (let userPayload of usersPayload) {
    state = addUser(state, userPayload);
  }
  return state;
}

function addUser(state, userPayload) {
  let newUser = new User(userPayload);
  return state.set(newUser.id, newUser);
}

const instance = new UserStore(Dispatcher);
export default instance;
