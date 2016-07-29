import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Container } from "flux/utils";
import classNames from "classnames";

import * as NotificationsActionCreators from "../actions/NotificationsActionCreators";

import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import NotificationsStore from "../stores/NotificationsStore";

class Notifications extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object)
  }

  constructor(props) {
    super(props);
    this.onCloseNotification = this.onCloseNotification.bind(this);
  }

  onCloseNotification() {
    NotificationsActionCreators.dismissAll();
  }

  render() {
    const { notifications } = this.props;

    const messages = notifications
      .toArray()
      .map((notificationType) => (
        notificationType.toArray()
          .map((notification, index) => (
            <div
              key={`message-${index}`}
              className={classNames(
                "notifier-message flex-horizontal",
                { [`notifier-${notification.type}`]: true }
              )}
            >
              <div className="flex-spacer">
                {notification.text}
              </div>
              <span
                key="notifier-close"
                className="notifier-close"
                onClick={this.onCloseNotification}
              >&times;</span>
            </div>
          ))
      ));

    return (
      <ReactCSSTransitionGroup
        transitionName="notifier"
        component="div"
        className="minni-notifier"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {messages}
      </ReactCSSTransitionGroup>
    );
  }
}

class NotificationsContainer extends Component {
  static getStores() {
    return [NotificationsStore];
  }

  static calculateState() {
    return {
      notifications: NotificationsStore.getAllNotifications()
    };
  }

  render() {
    return <Notifications {...this.state} />;
  }
}

const container = Container.create(NotificationsContainer);
export default container;


const yolol = (x, type = "default", text) => {
  setTimeout(() => {
    console.log("dispatching yolol notification");
    dispatch({
      type: ActionTypes.NOTIFICATION,
      notification: {
        type,
        text
      }
    });
  }, x);
};

yolol(500, null, "Yolol la notification !");
yolol(2500, "info", "Yolol la notification !");
yolol(5000, "warn", "YOLOL la notification !");
yolol(7500, "error", "nan mais #YOLOL quoi!");
yolol(10000, "fatal", "FATAL #YOLOL!");
