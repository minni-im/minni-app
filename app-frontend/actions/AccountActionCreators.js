import { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountActionCreators");

export function selectAccount(accountSlug) {
  dispatch({
    type: ActionTypes.ACCOUNT_SELECT,
    accountSlug
  });
}

export function deselectCurrentAccount() {
  dispatch({
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
  }).then(({ ok, room, errors }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.ROOM_CREATE_SUCCESS,
        accountId,
        room
      });
    }
    dispatch({
      type: ActionTypes.ROOM_CREATE_FAILURE,
      accountId,
      room,
      errors
    });
    return { ok, room, errors };
  });
}
