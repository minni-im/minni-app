import Dispatcher, { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("UserActionCreators");

export function updateProfile( profile ) {
  dispatch( {
    type: ActionTypes.PROFILE_UPDATE,
    profile
  } );

  return request(EndPoints.USER_PROFILE, {
      method: "POST",
      body: profile
    })
    .then( ({ ok, message, user }) => {
      if ( ok ) {
        dispatch( {
          type: ActionTypes.PROFILE_UPDATE_SUCCESS,
          user
        } );
      } else {
        logger.error(message);
        dispatch( {
          type: ActionTypes.PROFILE_UPDATE_FAILURE,
          profile
        } );
      }
      return { ok, message };
    });
}
