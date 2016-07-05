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
        <div>
          People &amp; Bots matching
          &quot;<strong>{MENTION_SENTINEL}{this.props.prefix.slice(1)}</strong>&quot;
        </div>
      );
    }
    return "People & Bots";
  }

  renderRow(user, props) {
    return (
      <div {...props}>
        <div>
          <Avatar size={Avatar.SIZE.SMALL} user={user} />
          <strong>{user.nickname}</strong>
          {` - ${user.fullname}`}
        </div>
        <div className="suggestion-item--info">
          {user.status}
        </div>
      </div>
    );
  }
}
