import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, IDLE_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

function handleConnectionOpen() {
  // Let's start the timer
  this.startIdleTimeout();
  ActivityActionCreators.setOnline();
}

function handleConnectionLost() {
  this.cancelIdleTimeout();
}

function handleActivateIdle(state, { status, force }) {
  if (!force && status === USER_STATUS.ONLINE) {
    this.startIdleTimeout();
  }
  return status === USER_STATUS.IDLE;
}

function handleWindowFocus(state, { focused }) {
  if (focused) {
    this.cancelIdleTimeout();
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
    }
  }

  startIdleTimeout() {
    this.cancelIdleTimeout();
    this.idleTimeoutID = window.setTimeout(() => {
      ActivityActionCreators.setIdle();
    }, IDLE_TIMEOUT);
  }

  getInitialState() {
    return false;
  }

  isIdle() {
    return this.getState();
  }
}

export default new IdleStore(Dispatcher);
