import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountActionCreators");

export default {
  selectAccount(accountSlug) {
    dispatch({
      type: ActionTypes.ACCOUNT_SELECT,
      accountSlug
    });
  },

  deselectCurrentAccount() {
    dispatch({
      type: ActionTypes.ACCOUNT_DESELECT
    });
  },

  fetchUsers(accountId) {
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
  },

  fetchRooms(accountId) {
    logger.info(`Fecthing rooms for '${accountId}'`);
    dispatch({
      type: ActionTypes.LOAD_ROOMS,
      accountId
    });
    return request(EndPoints.ACCOUNT_ROOMS(accountId)).then(({ ok, rooms, message, errors }) => {
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
