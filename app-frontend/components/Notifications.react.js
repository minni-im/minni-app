import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Container } from "flux/utils";

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

  }

  render() {
    const { notifications } = this.props;

    const messages = notifications
      .toArray()
      .map((notificationType) => (
        notificationType.toArray().map((notification, index) => (
          <div
            key={index}
            className={notification.type}
          >
            {notification.text}
          </div>
        ))
      ));

    console.log(messages);
    return (
      <ReactCSSTransitionGroup
        transitionName="notifier"
        component="div"
        className="minni-notifier flex-horizontal"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
      >
        <div className="notifier--messages flex-spacer">
          {messages}
        </div>
        <div className="notifier--close" onClick={this.onCloseNotification}>&times;</div>
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


const yolol = (x, text) => {
  setTimeout(() => {
    console.log("dispatching yolol notification");
    dispatch({
      type: ActionTypes.NOTIFICATION,
      notification: {
        type: "info",
        text
      }
    });
  }, x);
};

yolol(2500, "Yolol la notification !");
yolol(3500, "YOLOL la notification !");
yolol(4500, "nan mais #YOLOL quoi!");
