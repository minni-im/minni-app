import React from "react";

import { UI } from "minni-plugins-toolkit";
const { TypeaheadResults } = UI;

const ROOM_SENTINEL = "#";

export default class extends TypeaheadResults {
  static className = "suggestions-room";
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
