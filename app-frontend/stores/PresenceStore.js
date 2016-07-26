import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, IDLE_TIMEOUT, AWAY_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import ConnectionStore from "./ConnectionStore";

import Logger from "../libs/Logger";
const logger = Logger.create("PresenceStore");

let idleTimeoutID;
let awayTimeoutID;
let autoStatus = true;

function cancelTimers() {
  if (!autoStatus) {
    return;
  }
  clearTimeout(idleTimeoutID);
  clearTimeout(awayTimeoutID);
  ActivityActionCreators.setOnline();
}

function activateAwayTimer() {
  ActivityActionCreators.setIdle();
  awayTimeoutID = setTimeout(() => {
    ActivityActionCreators.setAway();
  }, AWAY_TIMEOUT);
}

function activateIdleTimer() {
  idleTimeoutID = setTimeout(activateAwayTimer, IDLE_TIMEOUT);
}

function handleConnectionOpen() {
  cancelTimers();
  window.addEventListener("click", cancelTimers, true);
}

function handleUserStatus({ userId, status, force }) {
  const me = !userId;
  if (me && force) {
    autoStatus = false;
    cancelTimers();
    return;
  } else if (status === USER_STATUS.ONLINE) {
    autoStatus = true;
    activateIdleTimer();
  }
}

function handleWindowFocus({ focused }) {
  if (focused) {
    cancelTimers();
  }
}

class PresenceStore extends MapStore {
  initialize() {
    this.waitFor(ConnectionStore);
    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen));
    this.addAction(ActionTypes.SET_USER_STATUS, withNoMutations(handleUserStatus));

    this.addAction(ActionTypes.WINDOW_FOCUS, withNoMutations(handleWindowFocus));
  }
}

export default new PresenceStore(Dispatcher);
