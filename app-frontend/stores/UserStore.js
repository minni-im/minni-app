import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import User from "../models/User";

class UserStore extends MapStore {

  getInitialState() {
    let state = Immutable.Map();

    let dataHolder = document.getElementById("data-holder");
    let user = JSON.parse(dataHolder.dataset.user);
    dataHolder.parentNode.removeChild(dataHolder);

    let connectedUser = new User(user);
    this.connectedUserId = user.id;

    state = state.set(this.connectedUserId, connectedUser);
    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case "user/add":
        return addUser(state, action.payload);
      default:
        return state;
    }
  }

  getConnectedUser() {
    return this.get(this.connectedUserId);
  }
}


function addUser(state, userPayload) {
  if (state.get(userPayload.id)) {
    return state;
  }
  let newUser = new User(userPayload);
  return state.set(newUser.id, newUser);
}

const instance = new UserStore(Dispatcher);
export default instance;
