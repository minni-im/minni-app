import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, IDLE_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import Logger from "../libs/Logger";

const logger = Logger.create("IdleStore");

function handleConnectionOpen() {
  // Let's start the timer
  this.startIdleTimeout();
  ActivityActionCreators.setOnline();
}

function handleConnectionLost() {
  this.cancelIdleTimeout();
}

function handleActivateIdle(state, { status, force }) {
  const isIdle = status === USER_STATUS.IDLE;
  if (force) {
    this.cancelIdleTimeout();
    return isIdle;
  } else if (status === USER_STATUS.ONLINE) {
    this.startIdleTimeout();
  }

  return isIdle;
}

function handleWindowFocus(state, { focused, userForcedStatus }) {
  if (focused) {
    if (!userForcedStatus) {
      this.startIdleTimeout();
    } else {
      this.cancelIdleTimeout();
    }
    return false;
  }
  return state;
}

class IdleStore extends MapStore {
  idleTimeoutID = false;

  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen.bind(this)));
    this.addAction(ActionTypes.CONNECTION_LOST, withNoMutations(handleConnectionLost.bind(this)));
    this.addAction(ActionTypes.SET_USER_STATUS, handleActivateIdle);
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
  }

  cancelIdleTimeout() {
    if (this.idleTimeoutID) {
      window.clearTimeout(this.idleTimeoutID);
      this.idleTimeoutID = false;
      logger.info("Cleared idleTimeoutID");
    }
  }

  startIdleTimeout() {
    this.cancelIdleTimeout();
    this.idleTimeoutID = window.setTimeout(() => {
      ActivityActionCreators.setIdle();
    }, IDLE_TIMEOUT);
    logger.info("Activated idleTimeoutID");
  }

  getInitialState() {
    return false;
  }

  get isIdle() {
    return this.getState();
  }
}

export default new IdleStore(Dispatcher);
