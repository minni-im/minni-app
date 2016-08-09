import React from "react";
import { Container } from "flux/utils";

import RoomActionCreators from "../actions/RoomActionCreators";

import MessageStore from "../stores/MessageStore";
import MessageStateStore from "../stores/MessageStateStore";
import DimensionStore from "../stores/DimensionStore";
import UserStore from "../stores/UserStore";
import UserSettingsStore from "../stores/UserSettingsStore";

import Messages from "./Messages.react";

class MessagesContainer extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired
  }

  static getStores() {
    return [
      UserStore,
      UserSettingsStore,
      MessageStore,
      MessageStateStore,
      DimensionStore
    ];
  }

  static calculateState(prevProps, nextProps) {
    return {
      viewer: UserStore.getConnectedUser(),
      messages: MessageStore.getMessages(nextProps.room.id),
      messagesState: MessageStateStore.getMeta(nextProps.room.id),
      dimensions: DimensionStore.getDimensions(nextProps.room.id),
      renderEmbeds: UserSettingsStore.getValue("global.rooms.links_preview"),
      inlineImages: UserSettingsStore.getValue("global.rooms.image_preview")
    };
  }

  componentDidMount() {
    if (this.state.messages.size === 0) {
      RoomActionCreators.fetchMessages(this.props.room.id);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.messages !== nextState.messages ||
      this.state.messagesState !== nextState.messagesState ||
      this.props.room !== nextProps.room ||
      this.state.renderEmbeds !== nextState.renderEmbeds ||
      this.state.inlineImages !== nextState.inlineImages;
  }

  render() {
    return (
      <Messages room={this.props.room} {...this.state} />
    );
  }
}

const instance = Container.create(MessagesContainer, { withProps: true });
export default instance;
