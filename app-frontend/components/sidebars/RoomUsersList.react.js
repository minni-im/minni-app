import React, { Component, PropTypes } from "react";
import { Container } from "flux/utils";
import { USER_STATUS } from "../../Constants";

import Avatar from "../generic/Avatar.react";

import Room from "../../models/Room";

import UserStore from "../../stores/UserStore";
import TypingStore from "../../stores/TypingStore";
import SelectedAccountStore from "../../stores/SelectedAccountStore";

class RoomUsersList extends Component {
  static propTypes = {
    room: PropTypes.instanceOf(Room).isRequired,
  };

  static getStores() {
    return [TypingStore, UserStore];
  }

  static calculateState(prevProps, nextProps) {
    const nextRoom = nextProps.room;
    let users;
    if (nextRoom.private) {
      users = UserStore.getUsers([UserStore.getConnectedUser().id, ...nextRoom.usersId]);
    } else {
      const account = SelectedAccountStore.getAccount() || {};
      users = UserStore.getUsers(account.usersId);
    }
    const WEIGHT = {
      [USER_STATUS.OFFLINE]: "z",
      [USER_STATUS.ONLINE]: "a",
      [USER_STATUS.IDLE]: "b",
      [USER_STATUS.DND]: "c",
      [USER_STATUS.AWAY]: "d",
      [USER_STATUS.OFFLINE]: "z",
    };
    users = users.toArray().sort((a, b) => WEIGHT[a.status] > WEIGHT[b.status]);

    return {
      users,
      typingUsers: TypingStore.getTypingUsers(nextRoom.id),
    };
  }

  render() {
    return (
      <div className="room--users-list flex-horizontal">
        {this.state.users.map((user, index) => (
          <Avatar
            key={index}
            withStatus
            showOffline
            user={user}
            isTyping={this.state.typingUsers.has(user.id)}
          />
        ))}
      </div>
    );
  }
}

const container = Container.create(RoomUsersList, { withProps: true });
export default container;
