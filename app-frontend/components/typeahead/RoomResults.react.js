import React from "react";
import TypeAheadResults from "./TypeAheadResults.react";

export const ROOM_SENTINEL = "#";

export default class RoomTypeAhead extends TypeAheadResults {
  transformSelectionToText(room) {
    return ROOM_SENTINEL + room.slug;
  }

  renderHeader() {
    return (
      <div>Rooms matching <strong>{this.props.prefix.slice(0)}</strong></div>
    );
  }

  renderRow(room, props) {
    return (
      <div {...props}>
        <div>{room.name} <em>{`${ROOM_SENTINEL}${room.slug}`}</em></div>
      </div>
    );
  }
}
