import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withRouter } from "react-router-dom";
import { isMobile } from "react-device-detect";

import * as RoomActionCreators from "../actions/RoomActionCreators";

import RoomSettingsIcon from "./RoomSettingsIcon.react";
import RoomUsersList from "./sidebars/RoomUsersList.react";
import MessagesContainer from "./MessagesContainer.react";
import Composer from "./Composer.react";
import TypingInfo from "./TypingInfo.react";
import FormattingHints from "./FormatingHints.react";

import RoomModel from "../models/Room";

import { MenuIcon, FavoriteIcon, CloseIcon } from "../utils/IconsUtils";
import { parseTitle } from "../utils/MarkupUtils";

import ComposerStore from "../stores/ComposerStore";

import { MAX_MESSAGE_LENGTH } from "../Constants";

class Room extends React.PureComponent {
  static propTypes = {
    room: PropTypes.instanceOf(RoomModel).isRequired,
    connection: PropTypes.bool,
    multiRooms: PropTypes.bool,
    history: PropTypes.object.isRequired,
    editMode: PropTypes.bool,
  };

  static defaultProps = {
    multiRooms: false,
    connection: false,
    editMode: false,
  };

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

  componentDidUpdate(prevProps) {
    const { editMode } = this.props;
    if (editMode !== prevProps.editMode && editMode === false) {
      this.focusComposer();
    }
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

  handleRoomLeave() {
    const { room } = this.props;
    /* eslint-disable */
    let [
      app,
      accountSlug,
      messages,
      roomSlugs,
    ] = document.location.pathname.slice(1).split("/");
    /* eslint-enable  */
    roomSlugs = roomSlugs.split(",");
    roomSlugs.splice(roomSlugs.indexOf(room.slug), 1);
    this.props.history.push(
      `/chat/${accountSlug}/messages/${roomSlugs.join(",")}`
    );
  }

  handleMobileDrawerToggle() {
    document.getElementById("minni").classList.toggle("menu-left");
  }

  render() {
    const { room, multiRooms, connection } = this.props;
    const { name, topic } = room;
    const defaultValue = ComposerStore.getSavedText(room.id);
    return (
      <section
        className={classnames("flex-vertical", "flex-spacer", {
          "room--favorite": room.starred,
        })}
      >
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>
              {isMobile && (
                <MenuIcon
                  className="mobile-toggle"
                  onClick={this.handleMobileDrawerToggle}
                />
              )}
              <span>{parseTitle(name)}</span>
              <span
                className="icon icon--favorite"
                onClick={this.handleRoomFavoriteToggle}
              >
                <FavoriteIcon />
              </span>
            </h2>
            <h3>{parseTitle(topic)}</h3>
          </div>
          <div className="actions">
            <RoomSettingsIcon room={room} />
            {multiRooms && (
              <span
                className="icon"
                onClick={this.handleRoomLeave}
                title="Close this room panel"
              >
                <CloseIcon />
              </span>
            )}
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
            disabled={!connection}
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

export default withRouter(Room);
