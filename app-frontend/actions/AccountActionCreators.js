import { dispatchAsync, dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import * as NotificationsActionCreators from "./NotificationsActionCreators";

import Logger from "../libs/Logger";

const logger = Logger.create("AccountActionCreators");

export function createAccount({ name, description }) {
  dispatch({
    type: ActionTypes.ACCOUNT_CREATE,
    name,
    description
  });
  return request(EndPoints.ACCOUNT_CREATE, {
    method: "PUT",
    body: {
      name,
      description
    }
  }).then(({ ok, account, room, message, errors }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.ACCOUNT_CREATE_SUCCESS,
        account,
        room
      });
    } else {
      dispatch({
        type: ActionTypes.ACCOUNT_CREATE_FAILURE,
        name,
        message,
        error: errors
      });
    }
    return { ok, account, message, error: errors };
  });
}

export function checkExistence(name) {
  return request(EndPoints.ACCOUNT_CHECK_EXISTENCE(name))
    .then(({ ok, message }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.ACCOUNT_CHECK_VALID,
          name,
          message
        });
      } else {
        dispatch({
          type: ActionTypes.ACCOUNT_CHECK_INVALID,
          name,
          message
        });
      }
      return { ok, message };
    });
}

export function selectAccount(accountSlug) {
  dispatch({
    type: ActionTypes.ACCOUNT_SELECT,
    accountSlug
  });
}

export function deselectCurrentAccount() {
  dispatchAsync({
    type: ActionTypes.ACCOUNT_DESELECT
  });
}

export function fetchUsers(accountId) {
  logger.info(`Fecthing users for '${accountId}'`);
  dispatch({
    type: ActionTypes.LOAD_USERS,
    accountId
  });
  return request(EndPoints.ACCOUNT_USERS(accountId)).then(({ ok, users, errors }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.LOAD_USERS_SUCCESS,
        accountId,
        users
      });
    } else {
      dispatch({
        type: ActionTypes.LOAD_USERS_FAILURE,
        accountId,
        errors
      });
    }
  });
}

export function fetchRooms(accountId) {
  logger.info(`Fecthing rooms for '${accountId}'`);
  dispatch({
    type: ActionTypes.LOAD_ROOMS,
    accountId
  });
  return request(EndPoints.ACCOUNT_ROOMS(accountId))
    .then(({ ok, rooms, errors }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.LOAD_ROOMS_SUCCESS,
          accountId,
          rooms
        });
      } else {
        dispatch({
          type: ActionTypes.LOAD_ROOMS_FAILURE,
          accountId,
          errors
        });
        NotificationsActionCreators.notifyError(
          "Something weird just occured. We did not manage to properly fetch some rooms."
        );
      }
    });
}

export function receiveRoom(room) {
  dispatch({
    type: ActionTypes.ROOM_CREATE_SUCCESS,
    userId: room.adminId,
    accountId: room.accountId,
    room
  });
}

export function createRoom(account, name, topic, type, usersId = []) {
  const { id: accountId } = account;
  logger.info(`Creating new room '${name}' for account:${accountId}`);
  dispatch({
    type: ActionTypes.ROOM_CREATE,
    accountId,
    name
  });
  return request(EndPoints.ACCOUNT_ROOMS(accountId), {
    method: "PUT",
    body: {
      name,
      topic,
      type,
      usersId
    }
  }).then(({ ok, room, message, errors }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.ROOM_CREATE_SUCCESS,
        accountId,
        room
      });
      NotificationsActionCreators.notify(
        `Your new room '${room.name}' has been successfuly created!`,
        5000
      );
      return { ok, room };
    }
    dispatch({
      type: ActionTypes.ROOM_CREATE_FAILURE,
      accountId,
      room,
      message,
      errors
    });
    return { ok, room, errors, message };
  });
}
