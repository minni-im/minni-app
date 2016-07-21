import * as ActivityActionCreators from "../actions/ActivityActionCreators";
import { IDLE_TIMEOUT, AWAY_TIMEOUT, USER_STATUS } from "../Constants";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ActivityWatcherUtils");

let idleTimeoutID;
let awayTimeoutID;

function activateAwayTimer() {
  logger.info("User is going idle");
  ActivityActionCreators.setIdle();
  awayTimeoutID = setTimeout(() => {
    logger.info("User is going away");
    ActivityActionCreators.setAway();
  }, AWAY_TIMEOUT);
}

function activateIdleTimer() {
  idleTimeoutID = setTimeout(activateAwayTimer, IDLE_TIMEOUT);
}

function cancelTimers() {
  logger.info("Cancelling all timers");
  clearTimeout(idleTimeoutID);
  clearTimeout(awayTimeoutID);
  if (UserStore.getConnectedUser().status !== USER_STATUS.ONLINE) {
    ActivityActionCreators.setOnline();
  }
  activateIdleTimer();
}

export function initialize() {
  logger.info("Starting activity watcher");
  activateIdleTimer();
  window.addEventListener("click", cancelTimers, true);
}
