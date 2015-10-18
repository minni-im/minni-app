import React from "react";
import { Link } from "react-router";
import classnames from "classnames";

import { ActionTypes } from "../Constants";

import { SettingsIcon, FavoriteIcon } from "../utils/IconsUtils";

import { dispatch } from "../dispatchers/Dispatcher";

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

    return <Link to={`/chat/${accountName}/messages/${room.slug}`} className={classnames("room", this.props.className, {
        "room-favorite": room.starred
      })} key={room.id} title={title}>
      <div className="room--name">{room.name}</div>
      <div className="room--topic">{room.topic}</div>
      {settingsIcon}
      <span className="room--icon icon--favorite" onClick={this._onRoomStarClick.bind(this)}><FavoriteIcon /></span>
    </Link>;
  }

  _onRoomStarClick(event) {
    event.preventDefault();
    const { room } = this.props;
    dispatch({
      type: room.starred ? ActionTypes.ROOM_UNSTAR : ActionTypes.ROOM_STAR,
      roomId: room.id
    });
  }
}

Room.defaultProps = {
  className: {}
};

class RoomPublic extends React.Component {
  render() {
    return <Room className={classnames("room-public")} {...this.props} />;
  }
}

export default class Lobby extends React.Component {
  render() {
    const { account, rooms } = this.props;
    if (!account) {
      return false;
    }
    return <section>
      <header>
        <div className="header-info">
          <h2>Lobby</h2>
          <h3>{ account.description }</h3>
        </div>
        <div className="actions">
          <Link to={`/settings/${account.name}`} title="Settings"
            className="icon" activeClassName="icon--active">
            <SettingsIcon />
          </Link>
        </div>
      </header>
      <section className="panel">
        <header>
          <h2>Rooms</h2>
          <div className="actions">
            <Link to={`/chat/${account.name}/create`} className="button">Create a room</Link>
          </div>
        </header>
        <div className="rooms">
          {rooms.toArray().map(room => {
            return <RoomPublic key={room.id} room={room} accountName={account.name} viewer={this.props.viewer}/>;
          })}
        </div>
      </section>
    </section>;
  }
}
