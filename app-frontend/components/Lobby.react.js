import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";
import classnames from "classnames";

import { SettingsIcon, FavoriteIcon } from "../utils/IconsUtils";

import { dispatch } from "../dispatchers/Dispatcher";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import RoomStore from "../stores/RoomStore";


class Lobby extends React.Component {
  static getStores() {
    return [ RoomStore, SelectedAccountStore ];
  }

  static calculateState() {
    return {
      account: SelectedAccountStore.getAccount(),
      rooms: RoomStore.getCurrentRooms().sortBy(room => !room.starred)
    };
  }

  render() {
    const { account } = this.state;
    let rooms = [], allRoomSlugs = [];
    this.state.rooms.forEach(room => {
      allRoomSlugs.push(room.slug);
      let classNames = classnames("room", {
        "room-favorite": room.starred
      });

      let settings;
      if (this.props.currentUser.id === room.adminId) {
        settings = <div className="room--icon icon icon--show-on-hover">
          <SettingsIcon />
        </div>;
      }
      let title = room.name;
      if (__DEV__) {
        title += ` - ${room.id}`;
      }
      rooms.push(<Link to={`/chat/${account.name}/messages/${room.slug}`} className={classNames} key={room.id} title={title}>
        <div className="room--name">{room.name}</div>
        <div className="room--topic">{room.topic}</div>
        {settings}
        <div className="room--icon icon icon--favorite">
          <FavoriteIcon onClick={this._onRoomStarClick.bind(this, room.id, room.starred)}/>
        </div>
      </Link>);
    });

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
            <Link to={`/chat/${account.name}/messages/${allRoomSlugs.join(",")}`} className="button">Open all rooms</Link>
            <Link to={`/chat/${account.name}/create`} className="button">Create a room</Link>
          </div>
        </header>
        <div className="rooms">
          {rooms}
        </div>
      </section>
    </section>;
  }

  _onRoomStarClick(roomId, starred, event) {
    event.preventDefault();
    dispatch({
      type: starred ? "room/unstar" : "room/star",
      roomId: roomId
    });
  }

}

const LobbyContainer = Container.create(Lobby);
export default LobbyContainer;
