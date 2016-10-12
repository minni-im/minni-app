import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function sessionStart() {
  dispatch({
    type: ActionTypes.SESSION_START
  });
}

window.start = sessionStart;
