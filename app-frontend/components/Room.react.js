import React from "react";
import classnames from "classnames";

import * as RoomActionCreators from "../actions/RoomActionCreators";

import RoomSettingsIcon from "./RoomSettingsIcon.react";
import RoomUsersList from "./sidebars/RoomUsersList.react";
import MessagesContainer from "./MessagesContainer.react";
import Composer from "./Composer.react";
import TypingInfo from "./TypingInfo.react";
import FormattingHints from "./FormatingHints.react";

import { FavoriteIcon, CloseIcon } from "../utils/IconsUtils";
import { parseTitle } from "../utils/MarkupUtils";

import ComposerStore from "../stores/ComposerStore";

import { MAX_MESSAGE_LENGTH } from "../Constants";

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.handleRoomLeave = this.handleRoomLeave.bind(this);
    this.handleRoomFavoriteToggle = this.handleRoomFavoriteToggle.bind(this);
    this.handleFooterOnClick = this.handleFooterOnClick.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  componentDidMount() {
    this.focusComposer();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.room !== this.props.room;
  }

  focusComposer() {
    this.composer.focus();
  }

  handleSendMessage(message) {
    if (message.length === 0) {
      return false;
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      // TODO: show an alert message here
      return false;
    }
    RoomActionCreators.sendMessage(this.props.room.id, message);
    return true;
  }

  handleFooterOnClick() {
    this.focusComposer();
  }

  handleRoomFavoriteToggle() {
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }

  handleRoomLeave(event) {
    const { room, multiRooms } = this.props;
    /* eslint-disable */
    let [app, accountSlug, messages, roomSlugs] = document.location.pathname.slice(1).split("/");
    /* eslint-enable  */
    if (!multiRooms) {
      this.context.router.transitionTo({ pathname: `/chat/${accountSlug}/lobby` });
    } else {
      roomSlugs = roomSlugs.split(",");
      roomSlugs.splice(roomSlugs.indexOf(room.slug), 1);
      this.context.router.transitionTo(`/chat/${accountSlug}/messages/${roomSlugs.join(",")}`);
    }

    if (!event.shiftKey) {
      RoomActionCreators.leaveRoom(accountSlug, room.slug);
    }
  }

  render() {
    const { room, multiRooms } = this.props;
    const { name, topic } = room;
    const defaultValue = ComposerStore.getSavedText(room.id);

    return (
      <section
        className={classnames("flex-vertical", "flex-spacer", { "room--favorite": room.starred })}
      >
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>
              <span>{parseTitle(name)}</span>
              <span className="icon icon--favorite" onClick={this.handleRoomFavoriteToggle}>
                <FavoriteIcon />
              </span>
            </h2>
            <h3>{parseTitle(topic)}</h3>
          </div>
          <div className="actions">
            {/* <span
              className="icon icon-active"
              title="Toggle connected users panel"
            >
              <RoomIcons.RoomPublicIcon />
            </span> */
            }
            <RoomSettingsIcon room={room} />
            <span
              className="icon"
              onClick={this.handleRoomLeave}
              title={
                multiRooms
                  ? "Leave this room (Shift+Click will just deselect it)"
                  : "Leave this room"
              }
            >
              <CloseIcon />
            </span>
          </div>
        </header>
        {room.usersList ? <RoomUsersList room={room} /> : null}
        <MessagesContainer room={room} />
        <footer className="flex-vertical" onClick={this.handleFooterOnClick}>
          <Composer
            ref={(composer) => {
              this.composer = composer;
            }}
            room={room}
            defaultValue={defaultValue}
            onSubmit={this.handleSendMessage}
          />
          <div className="footer flex-horizontal">
            <TypingInfo room={room} />
            &nbsp;
            <div className="contextual-info">
              <FormattingHints />
            </div>
          </div>
        </footer>
      </section>
    );
  }
}

Room.contextTypes = {
  router: React.PropTypes.object.isRequired
};
