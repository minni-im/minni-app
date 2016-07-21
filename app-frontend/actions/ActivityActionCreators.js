import { dispatch } from "../Dispatcher";
import { ActionTypes, USER_STATUS } from "../Constants";

export function setOnline(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.ONLINE,
    userId
  });
}

export function setOffline(userId) {
  dispatch({
    type: ActionTypes.USER_STATUS,
    status: USER_STATUS.OFFLINE,
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
