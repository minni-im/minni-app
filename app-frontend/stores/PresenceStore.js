import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, IDLE_TIMEOUT, AWAY_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import ConnectionStore from "./ConnectionStore";
import UserStore from "./UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("PresenceStore");

let idleTimeoutID;
let awayTimeoutID;
let autoStatus = false;

function cancelTimers() {
  clearTimeout(idleTimeoutID);
  clearTimeout(awayTimeoutID);
  if (!autoStatus) {
    return;
  }
  ActivityActionCreators.setOnline();
}

function activateAwayTimer() {
  ActivityActionCreators.setIdle();
  logger.info("Activating AWAY timer");
  awayTimeoutID = setTimeout(() => {
    ActivityActionCreators.setAway();
  }, AWAY_TIMEOUT);
}

function activateIdleTimer() {
  logger.info("Activating IDLE timer");
  idleTimeoutID = setTimeout(activateAwayTimer, IDLE_TIMEOUT);
}

function handleConnectionOpen() {
  autoStatus = true;
  cancelTimers();
  window.addEventListener("click", cancelTimers, true);
}

function handleConnectionLost() {
  autoStatus = false;
  cancelTimers();
  window.removeEventListener("click", cancelTimers);
}

function handleUserStatus({ status, force }) {
  if (force) {
    autoStatus = false;
    cancelTimers();
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
    this.addAction(ActionTypes.CONNECTION_LOST, withNoMutations(handleConnectionLost));
    this.addAction(ActionTypes.SET_USER_STATUS, withNoMutations(handleUserStatus));
    this.addAction(ActionTypes.WINDOW_FOCUS, withNoMutations(handleWindowFocus));
  }
}

export default new PresenceStore(Dispatcher);
