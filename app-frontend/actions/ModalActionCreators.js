import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes } from "../Constants";

export default {
  pop() {
    dispatch({
      type: ActionTypes.MODAL_POP
    });
  },

  push(modal) {
    dispatch({
      type: ActionTypes.MODAL_PUSH,
      modal
    });
  }
};
