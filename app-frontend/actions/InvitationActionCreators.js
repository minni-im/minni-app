import UserStore from "../stores/UserStore";
import { request } from "../utils/RequestUtils";

import { dispatch, dispatchMaybe } from "../Dispatcher";
import { ActionTypes, EndPoints, INVITATION_MAX_AGE } from "../Constants";

export function getInvitationList(accountId) {
  dispatch({
    type: ActionTypes.LOAD_INVITATIONS,
    accountId
  });
  return request(EndPoints.INVITATION_LIST(accountId))
    .then(({ ok, invites, error, message }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.LOAD_INVITATIONS_SUCCESS,
          invites,
          accountId
        });
      } else {
        dispatch({
          type: ActionTypes.LOAD_INVITATIONS_FAILURE,
          error,
          message
        });
      }
      return { ok, invites, error, message };
    });
}

export function createInvite(accountId, maxAge = INVITATION_MAX_AGE, maxUsage) {
  const { id: userId } = UserStore.getConnectedUser();
  dispatchMaybe({
    type: ActionTypes.INVITATION_CREATE,
    accountId
  });
  return request(EndPoints.INVITATION_CREATE, {
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
        type: ActionTypes.INVITATION_CREATE_SUCCESS,
        accountId,
        invite
      });
    } else {
      dispatch({
        type: ActionTypes.INVITATION_CREATE_FAILURE,
        accountId,
        errors,
        message
      });
    }
    return args;
  });
}

export function deleteInvite(inviteToken) {
  dispatch({
    type: ActionTypes.INVITATION_DELETE,
    inviteToken
  });
  return request(EndPoints.INVITATION_DELETE(inviteToken), {
    method: "DELETE"
  }).then((payload) => {
    const { ok, invite, errors, message } = payload;
    if (ok) {
      dispatch({
        type: ActionTypes.INVITATION_DELETE_SUCCESS,
        invite
      });
    } else {
      dispatch({
        type: ActionTypes.INVITATION_DELETE_FAILURE,
        inviteToken,
        errors,
        message
      });
    }
    return payload;
  });
}

export function validateInvite(inviteToken) {
  dispatch({
    type: ActionTypes.INVITATION_VALIDATE,
    inviteToken
  });
  return request(EndPoints.INVITATION_VALIDATE(inviteToken))
    .then((payload) => {
      const { ok, invite, errors, message } = payload;
      if (ok) {
        dispatch({
          type: ActionTypes.INVITATION_VALIDATE_SUCCESS,
          inviteToken,
          invite
        });
      } else {
        dispatch({
          type: ActionTypes.INVITATION_VALIDATE_FAILURE,
          inviteToken,
          errors,
          message
        });
      }
      return payload;
    });
}

export function acceptInvite(inviteToken) {
  dispatch({
    type: ActionTypes.INVITATION_ACCEPT,
    inviteToken
  });
  return request(EndPoints.INVITATION_ACCEPT(inviteToken), {
    method: "POST"
  }).then((payload) => {
    const { ok, account, errors, message } = payload;
    if (ok) {
      dispatch({
        type: ActionTypes.INVITATION_ACCEPT_SUCCESS,
        inviteToken,
        account
      });
    } else {
      dispatch({
        type: ActionTypes.INVITATION_ACCEPT_FAILURE,
        inviteToken,
        errors,
        message
      });
    }
    return payload;
  });
}
