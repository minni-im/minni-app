import deepExtend from "deep-extend";

import Logger from "../libs/Logger";
const logger = Logger.create("SettingActionCreators");
import Dispatcher, { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import UserSettingsStore from "../stores/UserSettingsStore";

export function updateSettings(settings) {
  settings = deepExtend(
    UserSettingsStore.getSettings(),
    settings
  );

  dispatch( {
    type: ActionTypes.SETTINGS_UPDATE,
    settings
  } );

  request( EndPoints.USER_SETTINGS, {
    method: "POST",
    body: settings
  } ).then( ( { ok, message } ) => {
    if ( ok ) {
      dispatch( {
        type: ActionTypes.SETTINGS_UPDATE_SUCCESS,
        settings
      } );
    } else {
      logger.error( message );
      dispatch( {
        type: ActionTypes.SETTINGS_UPDATE_FAILURE,
        settings
      } );
    }
  });
}
