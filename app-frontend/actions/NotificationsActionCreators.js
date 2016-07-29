import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function notify(type, message) {
  dispatch({
    type: ActionTypes.NOTIFICATION,
    notification: {
      type,
      text: message
    }
  });
}

export function dismiss(notification) {
  dispatch({
    type: ActionTypes.NOTIFICATION_ACK,
    notification
  });
}

export function dismissAll() {
  dispatch({
    type: ActionTypes.NOTIFICATION_ACK_ALL
  });
}
