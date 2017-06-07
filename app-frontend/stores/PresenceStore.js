import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import ConnectionStore from "./ConnectionStore";
import IdleStore from "./IdleStore";
import AwayStore from "./AwayStore";

import Logger from "../libs/Logger";

const logger = Logger.create("PresenceStore");

function handleStatusUpdate(state, { status, force }) {
  if (force === true) {
    logger.info(`Activating forced status: ${status}`);
  }
  return state.set("forcedStatus", force === true);
}

function handleWindowFocus(state, { focused }) {
  if (focused && state.get("forcedStatus") === false) {
    ActivityActionCreators.setOnline();
  }
  return state;
}

function handleActivateOnline(state) {
  if (state.get("forcedStatus") === false) {
    ActivityActionCreators.setOnline();
  }
  return state;
}

function checkConnection(action) {
  return function (state, payload) {
    if (!ConnectionStore.isConnected()) {
      return state;
    }
    return action.call(this, state, payload);
  };
}

class PresenceStore extends MapStore {
  initialize() {
    this.waitFor(ConnectionStore, IdleStore, AwayStore);
    this.addAction(ActionTypes.SET_USER_STATUS, checkConnection(handleStatusUpdate));
    this.addAction(ActionTypes.WINDOW_FOCUS, checkConnection(handleWindowFocus));
    this.addAction(
      ActionTypes.TYPING_START,
      ActionTypes.ACCOUNT_SELECT,
      ActionTypes.ROOM_SELECT,
      checkConnection(handleActivateOnline)
    );
  }

  getInitialState() {
    return Immutable.fromJS({ forcedStatus: false });
  }

  get isForcedStatus() {
    return this.getState().get("forcedStatus");
  }
}

export default new PresenceStore(Dispatcher);
