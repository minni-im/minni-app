import React, { Component } from "react";
import PropTypes from "prop-types";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Container } from "flux/utils";
import classNames from "classnames";

import * as NotificationsActionCreators from "../actions/NotificationsActionCreators";

import NotificationsStore from "../stores/NotificationsStore";

class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.object,
  };

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

    const messages = notifications.toArray().map(notificationType =>
      notificationType.toArray().map(notification => (
        <CSSTransition
          key={notification.id}
          classNames="notifier"
          timeout={{ enter: 250, exit: 250 }}
        >
          <div
            className={classNames("notifier-message flex-horizontal", {
              [`notifier-${notification.role}`]: true,
            })}
          >
            <div className="flex-spacer">{notification.content}</div>
            {notification.autoDismissable ? (
              false
            ) : (
              <span
                key="notifier-close"
                className="notifier-close"
                data-id={notification.id}
                onClick={this.onCloseNotification}
              >
                &times;
              </span>
            )}
          </div>
        </CSSTransition>
      ))
    );

    return <TransitionGroup className="minni-notifier">{messages}</TransitionGroup>;
  }
}

class NotificationsContainer extends Component {
  static getStores() {
    return [NotificationsStore];
  }

  static calculateState() {
    return {
      notifications: NotificationsStore.getAllNotifications(),
    };
  }

  render() {
    return <Notifications {...this.state} />;
  }
}

const container = Container.create(NotificationsContainer);
export default container;
