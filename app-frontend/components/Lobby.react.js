import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";
import classnames from "classnames";

import { SettingsIcon, FavoriteIcon } from "../utils/Icons";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";



class Lobby extends React.Component {
  static getStores() {
    return [ AccountStore, RoomStore ];
  }

  static calculateState(prevState, prevProps) {
    return {
      rooms: RoomStore.getForAccount(prevProps.currentAccount.id),
      accounts: AccountStore.getState()
    };
  }

  render() {
    const account = this.props.currentAccount;
    let rooms = [], allRoomSlugs = [];
    this.state.rooms.toIndexedSeq().forEach(room => {
      allRoomSlugs.push(room.slug);
      let classNames = classnames("room", {
        "room-favorite": room.starred
      });

      let settings;
      if (this.props.currentUser.id === room.adminId) {
        settings = <div className="room--icon icon">
          <SettingsIcon />
        </div>;
      }
      rooms.push(<Link to={`/chat/${account.name}/messages/${room.slug}`} className={classNames} key={room.id}>
        <div className="room--name">{room.name}</div>
        <div className="room--topic">{room.topic}</div>
        {settings}
        <div className="room--icon icon icon--favorite">
          <FavoriteIcon />
        </div>
      </Link>);
    });

    return <section>
      <header>
        <div className="header-info">
          <h2>Lobby</h2>
          <h3>{ account.displayName }</h3>
        </div>
        <div className="actions">
          <Link to={`/settings/${account.name}`} title="Settings"
            className="icon" activeClassName="icon--active"><SettingsIcon /></Link>
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
}

const LobbyContainer = Container.create(Lobby, { withProps: true });
export default LobbyContainer;
