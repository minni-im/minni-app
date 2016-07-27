import React from "react";
import { Link } from "react-router";
import classnames from "classnames";

import RoomActionCreators from "../actions/RoomActionCreators";

import { SettingsIcon, FavoriteIcon, RoomIcons } from "../utils/IconsUtils";
import { parseTitleWithoutLinks } from "../utils/MarkupUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("Lobby");

class Room extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired,
    viewer: React.PropTypes.object.isRequired,
    accountName: React.PropTypes.string,
    className: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onRoomStarClick = this.onRoomStarClick.bind(this);
    this.onSettingsClick = this.onSettingsClick.bind(this);
  }

  onSettingsClick(event) {
    event.preventDefault();
  }

  onRoomStarClick(event) {
    event.preventDefault();
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }

  render() {
    const { accountName, room } = this.props;
    let title = __DEV__ ? `${room.name} - ${room.id}` : `${room.name}`;

    let settingsIcon;
    if (room.isUserAdmin(this.props.viewer.id)) {
      settingsIcon = (
        <span
          className="room--icon"
          onClick={this.onSettingsClick}
        >
          <SettingsIcon />
        </span>
      );
    }

    return (
      <Link
        to={`/chat/${accountName}/messages/${room.slug}`}
        className={classnames(
          "room", "flex-horizontal",
          this.props.className,
          {
            "room-favorite": room.starred,
            "room-public": room.public,
            "room-private": room.private
          }
        )}
        title={title}
      >
        <div className="room--name">
          {parseTitleWithoutLinks(room.name)}
        </div>
        {room.private ? <RoomIcons.RoomPrivateIcon className="icon" /> : null}
        <div className="room--topic flex-spacer">{parseTitleWithoutLinks(room.topic)}</div>
        {settingsIcon}
        <span
          className="room--icon icon--favorite"
          onClick={this.onRoomStarClick}
        >
          <FavoriteIcon />
        </span>
      </Link>
    );
  }
}

export default class Lobby extends React.Component {
  static propTypes = {
    account: React.PropTypes.object,
    rooms: React.PropTypes.object,
    viewer: React.PropTypes.object
  }

  render() {
    const { account, rooms } = this.props;
    if (!account) {
      return false;
    }

    let settingsIcon;
    if (account.isUserAdmin(this.props.viewer.id)) {
      settingsIcon = (
        <Link
          to={`/settings/${account.name}`}
          title="Edit this team's settings"
          className="icon"
          activeClassName="icon--active"
        >
          <SettingsIcon />
        </Link>
      );
    }

    return (
      <section className="flex-vertical flex-spacer">
        <header className="flex-horizontal">
          <div className="header-info flex-spacer">
            <h2>Lobby</h2>
            <h3>{account.description}</h3>
          </div>
          <div className="actions">
            {settingsIcon}
          </div>
        </header>
        <section className="panel panel--wrapper flex-spacer">
          <header className="rooms--header flex-horizontal">
            <h2 className="flex-spacer">Rooms</h2>
            <div className="actions">
              <Link
                to={`/chat/${account.name}/create`}
                className="button button-primary"
              >Create a room</Link>
            </div>
          </header>
          <div className="rooms--list">
            {rooms
              .sortBy(room => room.lastUpdated)
              .toArray()
              .reverse()
              .map((room, index) => (
                <Room
                  key={index}
                  room={room}
                  accountName={account.name}
                  viewer={this.props.viewer}
                />
              ))}
          </div>
        </section>
      </section>
    );
  }
}
