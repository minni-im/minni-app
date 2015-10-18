import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";

import classnames from "classnames";

import AccountStore from "../../stores/AccountStore";
import SelectedAccountStore from "../../stores/SelectedAccountStore";
import ConnectedRoomStore from "../../stores/ConnectedRoomStore";
import RoomStore from "../../stores/RoomStore";


import { LobbyIcon, RoomIcons } from "../../utils/IconsUtils";
import UserInfoPanel from "../UserInfoPanel.react";

import Logger from "../../libs/Logger";
const logger = Logger.create("MainSideBar");

class MainSidebar extends React.Component {
  static getStores() {
    return [ AccountStore, SelectedAccountStore, RoomStore, ConnectedRoomStore ];
  }

  static calculateState() {
    const account = SelectedAccountStore.getAccount();
    return {
      accountsSize: AccountStore.getState().size,
      account: account,
      rooms: ConnectedRoomStore.getRooms(account && account.slug || "----", [])
    };
  }

  render() {
    const { accountsSize, account, rooms } = this.state;
    if (!account) {
      return false;
    }
    let logo;
    if (accountsSize === 1) {
      logo = <h1>{Minni.name}</h1>;
    } else {
      logo = <h2 className="account">{account.displayName}</h2>;
    }

    return <header>
      {logo}
      <nav>
        <Link to={`/chat/${account.name}/lobby`}
          className="lobby" activeClassName="selected">
          <span className="icon"><LobbyIcon /></span>
          <span className="name">Lobby</span>
        </Link>
        {rooms.size > 0 ? <a className="lobby">Rooms</a> : false}
        {rooms.toSeq().sortBy(room => {
          return room.starred ? "a" : "z" + "-" + room.name;
        }).toArray().map(room => {
          return <Link key={room.id}
            className={classnames({
              "room--starred": room.starred
            })}
            activeClassName="selected" to={`/chat/${account.slug}/messages/${room.slug}`}>
            <span className="icon">
                <RoomIcons.RoomPublicIcon />
            </span>
            <span className="name">{room.name}</span>
          </Link>;
        })}
      </nav>
      <UserInfoPanel />
    </header>;
  }
}

const container = Container.create(MainSidebar);
export default container;
