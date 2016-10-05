import UserStore from "../stores/UserStore";
import { request } from "../utils/RequestUtils";

import { dispatch, dispatchMaybe } from "../Dispatcher";
import { ActionTypes, EndPoints, INVITE_MAX_AGE } from "../Constants";


export function createInvite(accountId, maxAge = INVITE_MAX_AGE, maxUsage) {
  const { id: userId } = UserStore.getConnectedUser();
  dispatchMaybe({
    type: ActionTypes.INVITE_CREATE,
    accountId
  });
  return request(EndPoints.INVITE_CREATE, {
    method: "PUT",
    body: {
      userId,
      accountId,
      maxAge,
      maxUsage
    }
  }).then((args) => {
    const { ok, invite, errors, message } = args;
    if (ok) {
      dispatch({
        type: ActionTypes.INVITE_CREATE_SUCCESS,
        accountId,
        invite
      });
    } else {
      dispatch({
        type: ActionTypes.INVITE_CREATE_FAILURE,
        accountId,
        errors,
        message
      });
    }
    return args;
  }, (error) => {
    console.log(error);
  });
}

export function deleteInvite(inviteId) {

}

export function validateInvite(inviteId) {
  dispatch({
    type: ActionTypes.INVITE_VALIDATE,
    inviteId
  });
  return request(EndPoints.INVITE_VALIDATE)
    .then((payload) => {
      const { ok, invite, errors, message } = payload;
      if (ok) {
        dispatch({
          type: ActionTypes.INVITE_VALIDATE_SUCCESS,
          inviteId,
          invite
        });
      } else {
        dispatch({
          type: ActionTypes.INVITE_VALIDATE_FAILURE,
          inviteId,
          errors,
          message
        });
      }
      return payload;
    });
}

export function acceptInvite(inviteId) {

}
