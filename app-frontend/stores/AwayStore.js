import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, AWAY_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import Logger from "../libs/Logger";

const logger = Logger.create("AwayStore");

function handleConnectionLost() {
  this.cancelAwayTimeout();
}

function handleActivateAway(state, { status }) {
  if (status === USER_STATUS.IDLE) {
    this.startAwayTimeout();
  } else {
    this.cancelAwayTimeout();
  }
  return status === USER_STATUS.AWAY;
}

function handleWindowFocus(state, { focused }) {
  if (focused) {
    this.cancelAwayTimeout();
    return false;
  }
  return state;
}

class AwayStore extends MapStore {
  awayTimeoutID = false;

  initialize() {
    this.addAction(ActionTypes.CONNECTION_LOST, withNoMutations(handleConnectionLost.bind(this)));
    this.addAction(ActionTypes.SET_USER_STATUS, handleActivateAway);
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
  }

  cancelAwayTimeout() {
    if (this.awayTimeoutID) {
      window.clearTimeout(this.awayTimeoutID);
      this.awayTimeoutID = false;
      logger.info("Cleared awayTimeoutID");
    }
  }

  startAwayTimeout() {
    this.awayTimeoutID = window.setTimeout(() => {
      ActivityActionCreators.setAway();
    }, AWAY_TIMEOUT);
    logger.info("Activated awayTimeoutID");
  }

  getInitialState() {
    return false;
  }

  get isAway() {
    return this.getState();
  }
}

export default new AwayStore(Dispatcher);
