import { dispatchAsync } from "../Dispatcher";
import { ActionTypes, USER_STATUS } from "../Constants";


export function setStatus(userId, status) {
  dispatchAsync({
    type: ActionTypes.USER_STATUS,
    status,
    userId
  });
}

export function setOnline(userId) {
  setStatus(userId, USER_STATUS.ONLINE);
}

export function setIdle(userId) {
  setStatus(userId, USER_STATUS.IDLE);
}

export function setAway(userId) {
  setStatus(userId, USER_STATUS.AWAY);
}

export function forceAway() {
  dispatchAsync({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.AWAY,
    force: true
  });
}

export function forceDnd() {
  dispatchAsync({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.DND,
    force: true
  });
}
