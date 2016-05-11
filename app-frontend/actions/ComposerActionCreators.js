import { dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export default {
  saveCurrentText(roomId, text) {
    dispatchAsync({
      type: ActionTypes.COMPOSER_TEXT_SAVE,
      roomId,
      text
    });
  }
};
