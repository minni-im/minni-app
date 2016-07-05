import React from "react";

import TypeAheadResults from "./TypeAheadResults.react";
import Avatar from "../generic/Avatar.react";

export const MENTION_SENTINEL = "@";

export default class MentionTypeAhead extends TypeAheadResults {
  transformSelectionToText(user) {
    return MENTION_SENTINEL + user.nickname;
  }

  renderHeader() {
    if (this.props.prefix.length > 1) {
      return (
        <div>Coworkers matching {MENTION_SENTINEL}<strong>{this.props.prefix.slice(1)}</strong></div>
      );
    }
    return "Coworkers & Bots";
  }

  renderRow(user, props) {
    return (
      <div {...props}>
        <div>
          <Avatar size={Avatar.SIZE.SMALL} user={user} />
          {user.fullname}{" "}
          <em>({MENTION_SENTINEL}{user.nickname})</em>
        </div>
        <div className="suggestion-item--info">
          {user.status}
        </div>
      </div>
    );
  }
}
