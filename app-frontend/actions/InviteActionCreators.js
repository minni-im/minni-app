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
  console.log("INVITE CREATION");
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
      console.log("CREATED!", invite);
      dispatch({
        type: ActionTypes.INVITE_CREATE_SUCCESS,
        accountId,
        invite
      });
    } else {
      console.log("FAILED !", errors);
      dispatch({
        type: ActionTypes.INVITE_CREATE_FAILURE,
        accountId,
        errors,
        message
      });
    }
    return args;
  }, (error) => {
    console.log("FAILED ! in error handler", error);
  });
}

export function deleteInvite(inviteId) {

}
