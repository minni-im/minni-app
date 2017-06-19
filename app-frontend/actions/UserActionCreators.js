import Dispatcher, { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("UserActionCreators");

export function receiveUser(accountId, user) {
  dispatch({
    type: ActionTypes.LOAD_USERS_SUCCESS,
    accountId,
    users: [user],
  });
}

export function updateProfile(profile) {
  dispatch({
    type: ActionTypes.PROFILE_UPDATE,
    profile,
  });

  return request(EndPoints.USER_PROFILE, {
    method: "POST",
    body: profile,
  }).then(({ ok, message, user }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.PROFILE_UPDATE_SUCCESS,
        user,
      });
    } else {
      logger.error(message);
      dispatch({
        type: ActionTypes.PROFILE_UPDATE_FAILURE,
        profile,
      });
    }
    return { ok, message };
  });
}

export function receiveUpdateProfile(profile) {
  // We don't have to updte connectedUser as this event would be emitted from connectedUser profile update
  if (UserStore.getConnectedUser().id !== profile.id) {
    dispatch({
      type: ActionTypes.PROFILE_UPDATE_SUCCESS,
      user: profile,
    });
  }
}
