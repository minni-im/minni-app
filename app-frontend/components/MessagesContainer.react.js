import React from "react";
import { Container } from "flux/utils";

import MessageStore from "../stores/MessageStore";
import UserStore from "../stores/UserStore";

import Messages from "./Messages.react";

class MessagesContainer extends React.Component {
  static getStores() {
    //TODO: add UserSettingsStore when it will be created
    return [ UserStore, MessageStore ];
  }

  static calculateState(prevProps, nextProps) {
    return {
      messages: MessageStore.getMessages(nextProps.room.id)
    };
  }

  render() {
    return <Messages room={this.props.room} messages={this.state.messages} />;
  }
}

const instance = Container.create(MessagesContainer, { withProps: true });
export default instance;
