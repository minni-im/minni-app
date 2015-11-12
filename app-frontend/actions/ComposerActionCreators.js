import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes } from "../Constants";

export default {
  saveCurrentText(roomId, text) {
    dispatch({
      type: ActionTypes.COMPOSER_TEXT_SAVE,
      roomId,
      text
    });
  }
};