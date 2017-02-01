import { dispatch } from "../Dispatcher";
import { ActionTypes, NOTIFICATION_ROLES } from "../Constants";

function send(role = "default", content, delay) {
  dispatch({
    type: ActionTypes.NOTIFICATION,
    role,
    content,
    dismiss: delay
  });
}

export function notify(content, delay) {
  send(undefined, content, delay);
}

export function notifyInfo(content, delay) {
  send(NOTIFICATION_ROLES.INFO, content, delay);
}

export function notifyWarning(content, delay) {
  send(NOTIFICATION_ROLES.WARNING, content, delay);
}

export function notifyError(content, delay) {
  send(NOTIFICATION_ROLES.ERROR, content, delay);
}

export function notifyFatal(content) {
  send(NOTIFICATION_ROLES.FATAL, content);
}

export function dismiss(notificationId) {
  dispatch({
    type: ActionTypes.NOTIFICATION_ACK,
    id: notificationId
  });
}

export function dismissAll() {
  dispatch({
    type: ActionTypes.NOTIFICATION_ACK_ALL
  });
}
