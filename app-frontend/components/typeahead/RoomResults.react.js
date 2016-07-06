import React from "react";
import TypeAheadResults from "./TypeAheadResults.react";

export const ROOM_SENTINEL = "#";

export default class RoomTypeAhead extends TypeAheadResults {
  transformSelectionToText(room) {
    return ROOM_SENTINEL + room.slug;
  }

  renderHeader() {
    return (
      <div>
        Rooms matching
        &quot;<strong>{this.props.prefix}</strong>&quot;
      </div>
    );
  }

  renderRow(room, props) {
    return (
      <div {...props}>
        <div>
          <strong>{`${ROOM_SENTINEL}${room.slug}`}</strong>
          {` - ${room.name}`}
        </div>
      </div>
    );
  }
}
