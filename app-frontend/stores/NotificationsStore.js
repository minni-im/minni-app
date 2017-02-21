import Immutable from "immutable";

import Dispatcher from "../Dispatcher";

import * as NotificationsActionCreators from "../actions/NotificationsActionCreators";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

let internalId = 0;

function scheduleDismiss(notifId, delay) {
  setTimeout(
    () => {
      NotificationsActionCreators.dismiss(notifId);
    },
    delay
  );
}

function handleNotification(state, { id, role, content, dismiss }) {
  const notificationId = id || internalId++;
  if (dismiss) {
    scheduleDismiss(notificationId, dismiss);
  }
  return state.update(role, Immutable.Set(), list => list.add({
    id: notificationId,
    role,
    content,
    autoDismissable: !!dismiss
  }));
}

function handleNotificationAck(state, { id }) {
  // TODO: Sounds complex... Could be done with an easier reducing
  const all = state.reduce((flat, list) => flat.add(list), Immutable.Set()).flatten(true);
  const notif = all.find(notification => notification.id === parseInt(id, 10));
  if (!notif) {
    return state;
  }
  return state.update(notif.role || "default", Immutable.Set(), list => list.delete(notif));
}

function handleNotificationAckAll(state) {
  return state.clear();
}

class NotificationsStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.NOTIFICATION, handleNotification);
    this.addAction(ActionTypes.NOTIFICATION_ACK, handleNotificationAck);
    this.addAction(ActionTypes.NOTIFICATION_ACK_ALL, handleNotificationAckAll);
  }

  getAllNotifications() {
    return this.getState();
  }
}

export default new NotificationsStore(Dispatcher);
