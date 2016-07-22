import { dispatch } from "../Dispatcher";
import { ActionTypes, USER_STATUS } from "../Constants";

export function setOnline(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.ONLINE,
    userId
  });
}

export function setIdle(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.IDLE,
    userId
  });
}

export function setAway(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.AWAY,
    userId
  });
}

export function forceAway() {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.AWAY,
    force: true
  });
}

export function setDnd(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.DND,
    userId
  });
}

export function forceDnd() {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.DND,
    force: true
  });
}
