import React, { Component, PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Container } from "flux/utils";
import classNames from "classnames";

import * as NotificationsActionCreators from "../actions/NotificationsActionCreators";

import NotificationsStore from "../stores/NotificationsStore";

class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onCloseNotification = this.onCloseNotification.bind(this);
  }

  onCloseNotification(event) {
    const id = event.currentTarget.dataset.id;
    NotificationsActionCreators.dismiss(id);
  }

  render() {
    const { notifications } = this.props;

    const messages = notifications
      .toArray()
      .map((notificationType) => (
        notificationType.toArray()
          .map(notification => (
            <div
              key={notification.id}
              className={classNames(
                "notifier-message flex-horizontal",
                { [`notifier-${notification.role}`]: true }
              )}
            >
              <div className="flex-spacer">
                {notification.content}
              </div>
              {notification.autoDismissable ? false : (
                <span
                  key="notifier-close"
                  className="notifier-close"
                  data-id={notification.id}
                  onClick={this.onCloseNotification}
                >&times;</span>
              )}
            </div>
          ))
      ));

    return (
      <ReactCSSTransitionGroup
        transitionName="notifier"
        component="div"
        className="minni-notifier"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={250}
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
