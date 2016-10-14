import React from "react";
import { Link } from "react-router";
import classnames from "classnames";
import { Container } from "flux/utils";

import * as ActivityActionCreators from "../../actions/ActivityActionCreators";
import * as RoomActionCreators from "../../actions/RoomActionCreators";

import { isOSX } from "../../utils/PlatformUtils";

import AccountStore from "../../stores/AccountStore";
import SelectedAccountStore from "../../stores/SelectedAccountStore";
import ConnectedRoomStore from "../../stores/ConnectedRoomStore";
import RoomStore from "../../stores/RoomStore";
import SelectedRoomStore from "../../stores/SelectedRoomStore";
import UnreadMessageStore from "../../stores/UnreadMessageStore";

import { RoomIcons, LogoutIcon } from "../../utils/IconsUtils";
import { parseTitle } from "../../utils/MarkupUtils";

import AccountName from "../AccountName.react";
import AccountLobbyLink from "../AccountLobbyLink.react";
import UserInfoPanel from "../UserInfoPanel.react";
import Popover from "../generic/Popover.react";

import { MAX_MULTI_ROOMS } from "../../Constants";

class MainSidebar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static getStores() {
    return [
      AccountStore, SelectedAccountStore,
      RoomStore, ConnectedRoomStore, SelectedRoomStore,
      UnreadMessageStore
    ];
  }

  static calculateState() {
    const account = SelectedAccountStore.getAccount();
    return {
      accountsSize: AccountStore.getState().size,
      account,
      selectedRooms: SelectedRoomStore.getRooms(),
      rooms: ConnectedRoomStore.getRooms(account && account.id)
    };
  }

  constructor(props) {
    super(props);
    this.onRoomClicked = this.onRoomClicked.bind(this);
    this.onRoomLeaveClicked = this.onRoomLeaveClicked.bind(this);
  }

  onRoomClicked(event) {
    const multiRoom = isOSX ?
      event.metaKey && event.shiftKey :
      event.ctrlKey && event.shiftKey;
    if (multiRoom) {
      event.preventDefault();
      const slugs = SelectedRoomStore.getRooms()
        .add(event.currentTarget.dataset.slug)
        .toArray();
      if (slugs.length <= MAX_MULTI_ROOMS) {
        this.context.router.transitionTo({ pathname: `/chat/${this.state.account.slug}/messages/${slugs}` });
      }
    }
  }

  onRoomLeaveClicked(event) {
    event.preventDefault();
    RoomActionCreators.leaveRoom(
      this.state.account.slug,
      event.target.parentNode.dataset.slug
    );
  }

  render() {
    const { accountsSize, account, rooms, selectedRooms } = this.state;
    let logo;
    if (accountsSize === 1) {
      logo = <h1>{Minni.name}</h1>;
    } else {
      logo = <AccountName className="account" />;
    }

    const closeUserInfoPopover = () => {
      this.userInfoPopover.close();
    };

    return (
      <header className="flex-vertical">
        {logo}
        <nav className="flex-vertical flex-spacer">
          <AccountLobbyLink
            className="lobby flex-horizontal"
          />
          <a className="separator">{rooms.size === 0 ? "No connected rooms" : "Rooms"}</a>
          {rooms.toSeq()
            .sortBy(room => (room.starred ? "a" : `z-${room.name}`))
            .toArray()
            .map((room) => {
              const selected = selectedRooms.has(room.slug);
              const unreadCount = UnreadMessageStore.getUnreadCount(account.id, room.id);
              return (
                <Link
                  key={room.id}
                  className={classnames("room", "flex-horizontal", {
                    "room--starred": room.starred,
                    "room--selected": selected,
                    "room--unread": unreadCount > 0
                  })}
                  onClick={this.onRoomClicked}
                  data-slug={room.slug}
                  to={`/chat/${account.slug}/messages/${room.slug}`}
                >
                  <span className="icon">
                    {room.private ?
                      <RoomIcons.RoomPrivateIcon /> :
                        <RoomIcons.RoomPublicIcon />
                    }
                  </span>
                  <span className="name">{parseTitle(room.name)}</span>
                  {unreadCount > 0 ? <span className="unread">{unreadCount}</span> : false}
                  <span
                    className="quit"
                    title="Leave this room"
                    onClick={this.onRoomLeaveClicked}
                  >×</span>
                </Link>
              );
            })}
        </nav>
        <Popover
          ref={(popover) => { this.userInfoPopover = popover; }}
          className="user-info--popover"
          buttonComponent={<UserInfoPanel />}
        >
          <ul className="menu">
            <li
              onClick={() => {
                ActivityActionCreators.forceAway();
                closeUserInfoPopover();
              }}
            >
              <span className="user-status-icon" data-status="4" />
              Away
            </li>
            <li
              onClick={() => {
                ActivityActionCreators.forceDnd();
                closeUserInfoPopover();
              }}
            >
              <span className="user-status-icon" data-status="5" />
              Do not disturb
            </li>
            <li
              onClick={() => {
                ActivityActionCreators.setOnline();
                closeUserInfoPopover();
              }}
            >
              <span className="user-status-icon" data-status="2" />
              Online
            </li>
            <li className="separator" />
            <li>
              <a href="/logout">
                <span className="icon">
                  <LogoutIcon />
                </span>
                Logout
              </a>
            </li>
          </ul>
        </Popover>
      </header>
    );
  }
}


const container = Container.create(MainSidebar);
export default container;
