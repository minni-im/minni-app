import React from "react";
import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import classnames from "classnames";

import * as RoomActionCreators from "../actions/RoomActionCreators";

import TimeAgo from "./generic/TimeAgo.react";
import RoomSettingsIcon from "./RoomSettingsIcon.react";

import { FavoriteIcon, RoomIcons, SettingsIcon, GroupIcon } from "../utils/IconsUtils";
import { parseTitleWithoutLinks } from "../utils/MarkupUtils";

import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";

const logger = Logger.create("Lobby");

class Room extends React.PureComponent {
  static propTypes = {
    room: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    accountName: PropTypes.string,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onRoomStarClick = this.onRoomStarClick.bind(this);
  }

  onRoomStarClick(event) {
    event.preventDefault();
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }

  render() {
    const { accountName, room } = this.props;
    const title = __DEV__ ? `${room.name} - ${room.id}` : `${room.name}`;
    const lastMsgUser = UserStore.get(room.lastMsgUserId);
    return (
      <Link
        to={`/chat/${accountName}/messages/${room.slug}`}
        className={classnames("room", "flex-vertical", this.props.className, {
          "room-favorite": room.starred,
          "room-public": room.public,
          "room-private": room.private,
        })}
        title={title}
      >
        <div className="flex-horizontal">
          <div className="room--name">
            {parseTitleWithoutLinks(room.name)}
          </div>
          {room.private &&
            <div className="room--icons-meta flex-horizontal">
              <RoomIcons.RoomPrivateIcon className="icon" />
              <GroupIcon />
              <div className="room--teammates">
                {room.usersId.length + 1}
              </div>
            </div>}
          <div className="room--topic flex-spacer">
            {!room.private && parseTitleWithoutLinks(room.topic)}
          </div>
          <RoomSettingsIcon className="room--icon" room={room} />
          <span className="room--icon icon--favorite" onClick={this.onRoomStarClick}>
            <FavoriteIcon />
          </span>
        </div>
        <div className="room--meta flex-horizontal">
          <div className="room--last-update">
            Last updated{" "}
            <TimeAgo className="room--last-update-ts" datetime={room.lastMsgTimestamp} /> by{" "}
            <span className="room--last-update-user">{lastMsgUser.fullname}</span>
          </div>
        </div>
      </Link>
    );
  }
}

export default class Lobby extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    rooms: PropTypes.object,
    viewer: PropTypes.object,
  };

  render() {
    const { account, rooms } = this.props;
    if (!account) {
      return false;
    }

    let settingsIcon;
    if (account.isUserAdmin(this.props.viewer.id)) {
      settingsIcon = (
        <NavLink
          to={`/settings/${account.name}`}
          title="Edit this team's settings"
          className="icon"
          activeClassName="icon--active"
        >
          <SettingsIcon />
        </NavLink>
      );
    }

    return (
      <section className="flex-vertical flex-spacer">
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>Lobby</h2>
            <h3>
              {account.description}
            </h3>
          </div>
          {/* <div className="actions">
            {settingsIcon}
          </div> */}
        </header>
        <section className="panel panel--wrapper flex-spacer">
          <header className="rooms--header flex-horizontal">
            <h2 className="flex-spacer">Rooms</h2>
            <div className="actions">
              <Link to={`/chat/${account.name}/create`} className="button button-primary">
                Create a room
              </Link>
            </div>
          </header>
          <div className="rooms--list">
            {rooms
              .toArray()
              .map(room =>
                (<Room
                  key={room.id}
                  room={room}
                  accountName={account.name}
                  viewer={this.props.viewer}
                />)
              )}
          </div>
        </section>
      </section>
    );
  }
}
