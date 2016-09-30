import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";
import Dispatcher from "../Dispatcher";

import Storage from "../libs/Storage";

const TOKEN = "utoken";

function handleLoginSuccess(state, { token }) {
  Storage.set(TOKEN, token);
  return state.set("token", token);
}

class AuthenticationStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.LOGIN_SUCCESS, handleLoginSuccess);
  }

  getInitialState() {
    const token = Storage.get(TOKEN);
    if (!token) { return Immutable.Map(); }
    return Immutable.fromJS({ token });
  }

  isAuthenticated() {
    return this.getState().has("token");
  }
}

export default new AuthenticationStore(Dispatcher);
