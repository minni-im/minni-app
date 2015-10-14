import React from "react";
import classnames from "classnames";
import { Link } from "react-router";

import { RoomIcons } from "../../utils/IconsUtils";

export default class RoomList extends React.Component {
  render() {
    let { account, rooms } = this.props;
    return <div className="room-list">
      {rooms.map(room => {
        let roomIcon = <RoomIcons.RoomPublicIcon />;
        if (room.private) {
          roomIcon = <RoomIcons.RoomPrivateIcon />;
        }
        return <Link key={room.id} to={`/chat/${account.slug}/messages/${room.slug}`}
          className={classnames("room", {
            "room--starred": room.starred,
            "room--public": room.public,
            "room--private": room.private
          })} activeClassName="selected">
          <span className="icon">{roomIcon}</span>
          <span className="name">{room.name}</span>
        </Link>;
      })}
    </div>;
  }
}
