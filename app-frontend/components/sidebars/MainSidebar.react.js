import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";

import classnames from "classnames";

import AccountStore from "../../stores/AccountStore";
import ConnectedRoomStore from "../../stores/ConnectedRoomStore";


import { LobbyIcon, RoomIcons } from "../../utils/IconsUtils";
import UserInfoPanel from "../UserInfoPanel.react";

class MainSidebar extends React.Component {
  static getStores() {
    return [ AccountStore, ConnectedRoomStore ];
  }

  static calculateState(/* prevState */) {
    const account = AccountStore.getCurrentAccount();
    return {
      accountsSize: AccountStore.getState().size,
      account: account,
      rooms: ConnectedRoomStore.getRooms(account.slug)
    };
  }

  render() {
    const { accountsSize, account, rooms } = this.state;

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
          <span className="icon">
            <LobbyIcon />
          </span>
          <span className="name">Lobby</span>
        </Link>
        {rooms.sortBy(room => {
          return room.name
        }).map(room => {
          if (!room) {
            return <div></div>;
          }
          return <Link key={room.id} activeClassName="selected" to={`/chat/${account.slug}/messages/${room.slug}`}>
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

const MainSidebarContainer = Container.create(MainSidebar);
export default MainSidebarContainer;
