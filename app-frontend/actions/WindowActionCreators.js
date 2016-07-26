import { dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function focus(focused) {
  dispatchAsync({
    type: ActionTypes.WINDOW_FOCUS,
    focused
  });
}
