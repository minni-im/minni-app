import React from "react";
import classnames from "classnames";
import { Link } from "react-router";

import { RoomIcons } from "../../utils/IconsUtils";
import { parseTitle } from "../../utils/MarkupUtils";

export default function RoomList(props) {
  const { account, rooms } = props;
  return (
    <div className="room-list">
      {rooms.map(room => {
        let roomIcon = <RoomIcons.RoomPublicIcon />;
        if (room.private) {
          roomIcon = <RoomIcons.RoomPrivateIcon />;
        }
        return (
          <Link
            key={room.id}
            to={`/chat/${account.slug}/messages/${room.slug}`}
            className={classnames("room", {
              "room--starred": room.starred,
              "room--public": room.public,
              "room--private": room.private
            })}
            activeClassName="selected"
          >
            <span className="icon">{roomIcon}</span>
            <span className="name">{parseTitle(room.name)}</span>
          </Link>
        );
      })}
    </div>
  );
}
