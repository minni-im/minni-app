import Dispatcher from "../Dispatcher";
import Immutable from "immutable";

import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

function handleNotification(state, { notification }) {
  return state.update(notification.type, Immutable.Set(), list => list.add(notification));
}

function handleNotificationAck(state, { notification }) {
  return state.update(notification.type, Immutable.Set(), list => list.delete(notification));
}

class NotificationsStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.NOTIFICATION, handleNotification);
    this.addAction(ActionTypes.NOTIFICATION_ACK, handleNotificationAck);
  }


  getAllNotifications() {
    return this.getState();
  }
}

export default new NotificationsStore(Dispatcher);
