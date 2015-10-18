import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountActionCreators");

export default {

  fetchUsers(accountId) {
    dispatch({
      type: ActionTypes.LOAD_USERS,
      accountId
    });
    return request(EndPoints.ACCOUNT_USERS(accountId)).then(({ ok, users, message, errors }) => {
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
  },

  fetchRooms(accountId) {
    logger.info(`Fecthing some rooms for '${accountId}'`);
    dispatch({
      type: ActionTypes.LOAD_ROOMS,
      accountId
    });
    return request(EndPoints.ACCOUNT_ROOMS(accountId)).then(({ ok, rooms, message, errors }) => {
      logger.info(`'${accountId}' ${ok}`, rooms);
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
};
