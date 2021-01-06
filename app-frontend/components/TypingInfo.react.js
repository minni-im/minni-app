import React from "react";
import { Container } from "flux/utils";

import UserStore from "../stores/UserStore";
import TypingStore from "../stores/TypingStore";

class TypingInfo extends React.Component {
  render() {
    const users = this.props.users;
    const viewer = UserStore.getConnectedUser();
    const list = users
      .keySeq()
      .filter((userId) => userId !== viewer.id)
      .slice(0, 4)
      .map((userId) => UserStore.getUser(userId))
      .map((user) => user.fullname)
      .toArray();

    let typingStream;
    switch (list.length) {
      case 1:
        typingStream = (
          <span>
            <strong>{list[0]}</strong> is typing...
          </span>
        );
        break;
      case 2:
        typingStream = (
          <span>
            <strong>{list[0]}</strong> and <strong>{list[1]}</strong> are
            typing...
          </span>
        );
        break;
      default:
        typingStream = list.reduce((result, userName, i) => {
          if (i === 0) {
            return result.concat(<strong key={String(i)}>{userName}</strong>);
          } else if (i === list.length - 1) {
            return result.concat(
              " and ",
              <strong key={String(i)}>{userName}</strong>,
              " are typing..."
            );
          }
          return result.concat(
            ", ",
            <strong key={String(i)}>{userName}</strong>
          );
        }, []);
    }
    return <div className="typing-info flex-spacer">{typingStream}</div>;
  }
}

class TypingInfoContainer extends React.Component {
  static getStores() {
    return [TypingStore];
  }

  static calculateState(prevProps, nextProps) {
    return {
      viewer: UserStore.getConnectedUser(),
      users: TypingStore.getTypingUsers(nextProps.room.id),
    };
  }

  render() {
    return <TypingInfo users={this.state.users} viewer={this.state.viewer} />;
  }
}

const container = Container.create(TypingInfoContainer, { withProps: true });
export default container;
