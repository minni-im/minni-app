import React from "react";
import { Link } from "react-router";
import classnames from "classnames";

import RoomActionCreators from "../actions/RoomActionCreators";

import { SettingsIcon, FavoriteIcon } from "../utils/IconsUtils";

import Logger from "../libs/Logger";
const logger = Logger.create("Lobby");

class Room extends React.Component {
  render() {
    const { accountName, room } = this.props;
    let title = __DEV__ ? `${room.name} - ${room.id}` : `${room.name}`;

    let settingsIcon;
    if (room.isUserAdmin(this.props.viewer.id)) {
      settingsIcon = <span className="room--icon"><SettingsIcon /></span>;
    }

    return <Link to={`/chat/${accountName}/messages/${room.slug}`} className={classnames("room", "flex-horizontal", this.props.className, {
        "room-favorite": room.starred,
        "room-public": room.public,
        "room-private": room.private
      })} key={room.id} title={title}>
      <div className="room--name">{room.name}</div>
      <div className="room--topic flex-spacer">{room.topic}</div>
      {settingsIcon}
      <span className="room--icon icon--favorite" onClick={this._onRoomStarClick.bind(this)}><FavoriteIcon /></span>
    </Link>;
  }

  _onRoomStarClick(event) {
    event.preventDefault();
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }
}

Room.defaultProps = {
  className: {}
};

export default class Lobby extends React.Component {
  render() {
    const { account, rooms } = this.props;
    if (!account) {
      return false;
    }

    let settingsIcon;
    if (account.isUserAdmin(this.props.viewer.id)) {
      settingsIcon = <Link to={`/settings/${account.name}`} title="Edit this team's settings"
        className="icon" activeClassName="icon--active">
        <SettingsIcon />
      </Link>;
    }

    return <section className="flex-vertical flex-spacer">
      <header className="flex-horizontal">
        <div className="header-info flex-spacer">
          <h2>Lobby</h2>
          <h3>{ account.description }</h3>
        </div>
        <div className="actions">
          {settingsIcon}
        </div>
      </header>
      <section className="panel panel--wrapper flex-spacer">
        <header className="rooms--header flex-horizontal">
          <h2 className="flex-spacer">Rooms</h2>
          <div className="actions">
            <Link to={`/chat/${account.name}/create`} className="button">Create a room</Link>
          </div>
        </header>
        <div className="rooms--list">
          {rooms.toArray().map(room => {
            return <Room key={room.id} room={room} accountName={account.name} viewer={this.props.viewer}/>;
          })}
        </div>
      </section>
    </section>;
  }
}
