import React from "react";
import { Container } from "flux/utils";

import { MAX_MESSAGES_PER_ROOMS } from "../Constants";
import RoomActionCreators from "../actions/RoomActionCreators";

import MessageStore from "../stores/MessageStore";
import UserStore from "../stores/UserStore";
import UserSettingsStore from "../stores/UserSettingsStore";

import Messages from "./Messages.react";

class MessagesContainer extends React.Component {
  static getStores() {
    return [ UserStore, UserSettingsStore, MessageStore ];
  }

  static calculateState(prevProps, nextProps) {
    return {
      viewer: UserStore.getConnectedUser(),
      messages: MessageStore.getMessages(nextProps.room.id),
      renderEmbeds: UserSettingsStore.getValue("global.rooms.links_preview"),
      inlineImages: UserSettingsStore.getValue("global.rooms.image_preview")
    };
  }

  componentDidMount() {
    if (this.state.messages.size === 0) {
      RoomActionCreators.fetchMessages(this.props.room.id);
    }
  }

  render() {
    return (
      <Messages
        room={ this.props.room }
        messages={ this.state.messages }
        viewer={ this.state.viewer }
        renderEmbeds={ this.state.renderEmbeds }
        inlineImages={ this.state.inlineImages } />
    );
  }
}

const instance = Container.create(MessagesContainer, { withProps: true });
export default instance;
