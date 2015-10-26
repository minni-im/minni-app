import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";

import history from "../../history";

import classnames from "classnames";

import AccountStore from "../../stores/AccountStore";
import SelectedAccountStore from "../../stores/SelectedAccountStore";
import ConnectedRoomStore from "../../stores/ConnectedRoomStore";
import RoomStore from "../../stores/RoomStore";
import SelectedRoomStore from "../../stores/SelectedRoomStore";

import { LobbyIcon, RoomIcons } from "../../utils/IconsUtils";
import UserInfoPanel from "../UserInfoPanel.react";

import Logger from "../../libs/Logger";
const logger = Logger.create("MainSideBar");

class MainSidebar extends React.Component {
  static getStores() {
    return [ AccountStore, SelectedAccountStore,
      RoomStore, ConnectedRoomStore, SelectedRoomStore ];
  }

  static calculateState() {
    const account = SelectedAccountStore.getAccount();
    return {
      accountsSize: AccountStore.getState().size,
      account: account,
      selectedRooms: SelectedRoomStore.getRooms(),
      rooms: ConnectedRoomStore.getRooms(account && account.slug || "----", [])
    };
  }

  render() {
    const { accountsSize, account, rooms, selectedRooms } = this.state;
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
        {rooms.size > 0 ? <a className="separator">Rooms</a> : false}
        {rooms.toSeq().sortBy(room => {
          return room.starred ? "a" : "z" + "-" + room.name;
        }).toArray().map(room => {
          const selected = selectedRooms.has(room.slug);
          return <Link key={room.id}
            className={classnames("room", {
              "room--starred": room.starred,
              "room--selected": selected
            })}
            onClick={this._onRoomClicked.bind(this)} data-slug={room.slug}
            to={`/chat/${account.slug}/messages/${room.slug}`}>
            <span className="icon">
                <RoomIcons.RoomPublicIcon />
            </span>
            <span className="name">{room.name}</span>
            <span className="quit" title="Quit this room">×</span>
          </Link>;
        })}
      </nav>
      <UserInfoPanel />
    </header>;
  }

  _onRoomClicked(event) {
    if (event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      const slugs = SelectedRoomStore.getRooms().add(event.currentTarget.dataset.slug).toArray();
      history.pushState(null, `/chat/${this.state.account.slug}/messages/${slugs}`);
    }
  }
}

const container = Container.create(MainSidebar);
export default container;
