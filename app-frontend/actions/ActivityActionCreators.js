import { dispatch, dispatchAsync } from "../Dispatcher";
import { ActionTypes, USER_STATUS } from "../Constants";

import UserStore from "../stores/UserStore";

export function setStatus(status) {
  dispatchAsync({
    type: ActionTypes.SET_USER_STATUS,
    status,
    oldStatus: (UserStore.getConnectedUser() && UserStore.getConnectedUser().status)
  });
}

export function updateStatus(userId, status) {
  dispatch({
    type: ActionTypes.UPDATE_USER_STATUS,
    userId,
    status
  });
}

export const setOnline = () => setStatus(USER_STATUS.ONLINE);
export const setIdle = () => setStatus(USER_STATUS.IDLE);
export const setAway = () => setStatus(USER_STATUS.AWAY);

export function forceAway() {
  dispatchAsync({
    type: ActionTypes.SET_USER_STATUS,
    status: USER_STATUS.AWAY,
    force: true
  });
}

export function forceDnd() {
  dispatchAsync({
    type: ActionTypes.SET_USER_STATUS,
    status: USER_STATUS.DND,
    force: true
  });
}
