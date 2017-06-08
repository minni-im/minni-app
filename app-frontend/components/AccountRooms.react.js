import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "flux/utils";
import classNames from "classnames";

import { Link } from "react-router";

import AccountLobbyLink from "./AccountLobbyLink.react";

import * as RoomActionCreators from "../actions/RoomActionCreators";

import { MAX_MULTI_ROOMS } from "../Constants";

import RoomModel from "../models/Room";
import AccountModel from "../models/Account";

import AccountRoomStore from "../stores/AccountRoomStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";
import UnreadMessageStore from "../stores/UnreadMessageStore";

import { isOSX } from "../utils/PlatformUtils";
import { RoomIcons } from "../utils/IconsUtils";

class Room extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    room: PropTypes.instanceOf(RoomModel).isRequired,
    selected: PropTypes.bool,
    unreadCount: PropTypes.number,
    onLeave: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return (
      this.props.room !== nextProps.room ||
      this.props.selected !== nextProps.selected ||
      this.props.unreadCount !== nextProps.unreadCount
    );
  }

  onClick(event, slug) {
    const multiRoom = isOSX ? event.metaKey && event.shiftKey : event.ctrlKey && event.shiftKey;
    if (multiRoom) {
      event.preventDefault();
      const slugs = SelectedRoomStore.getRooms().add(slug).toArray();
      const { slug: accountSlug } = SelectedAccountStore.getAccount();
      if (slugs.length <= MAX_MULTI_ROOMS) {
        this.context.router.transitionTo({ pathname: `/chat/${accountSlug}/messages/${slugs}` });
      }
    }
  }

  render() {
    const accountSlug = SelectedAccountStore.getAccount().slug;
    const { room, selected, unreadCount } = this.props;
    const { name, slug, starred } = room;
    return (
      <Link
        className={classNames("room", "flex-horizontal", {
          "room--starred": starred,
          "room--selected": selected,
          "room--unread": unreadCount > 0,
        })}
        onClick={event => this.onClick(event, slug)}
        to={`/chat/${accountSlug}/messages/${slug}`}
      >
        <span className="icon">
          {room.private ? <RoomIcons.RoomPrivateIcon /> : <RoomIcons.RoomPublicIcon />}
        </span>
        <span className="name">{name}</span>
        {unreadCount > 0 ? <span className="unread">{unreadCount}</span> : false}
        <span rel="button" className="quit" title="Leave this room" onClick={this.props.onLeave}>
          ×
        </span>
      </Link>
    );
  }
}

class AccountRooms extends Component {
  static getStores() {
    return [AccountRoomStore, ConnectedRoomStore, SelectedRoomStore, UnreadMessageStore];
  }

  static calculateState(prevState, { account }) {
    return {
      rooms: ConnectedRoomStore.getRooms(account && account.id) || [],
      selectedRooms: SelectedRoomStore.getRooms(),
    };
  }

  static propTypes = {
    account: PropTypes.instanceOf(AccountModel).isRequired,
    withAccountName: PropTypes.bool,
  };

  static defaultProps = {
    withAccountName: true,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.account !== nextProps.account) {
      this.setState({
        rooms: AccountRoomStore.getRooms(nextProps.account.id),
        selectedRooms: SelectedRoomStore.getRooms(),
      });
    }
  }

  onRoomLeaveClick(event, slug) {
    event.preventDefault();
    RoomActionCreators.leaveRoom(this.props.account.slug, slug);
  }

  render() {
    const { rooms, selectedRooms } = this.state;
    const { account, withAccountName } = this.props;
    const roomList = rooms
      .sortBy(({ starred, name }) => (starred ? `a-${name}` : `z-${name}`))
      .map(room =>
        (<Room
          key={room.slug}
          room={room}
          selected={selectedRooms.has(room.slug)}
          unreadCount={UnreadMessageStore.getUnreadCount(account.id, room.id)}
          onLeave={event => this.onRoomLeaveClick(event, room.slug)}
        />)
      )
      .toArray();
    return (
      <nav className="flex-vertical flex-spacer">
        <AccountLobbyLink className="lobby flex-horizontal" withAccountName={withAccountName} />
        <a className="separator">{rooms.size === 0 ? "No connected rooms" : "Rooms"}</a>
        {roomList}
      </nav>
    );
  }
}

export default Container.create(AccountRooms, { withProps: true });
