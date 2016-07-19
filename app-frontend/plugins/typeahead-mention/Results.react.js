import React from "react";

import TypeAheadResults from "../../components/typeahead/TypeAheadResults.react";
import { UI } from "../../libs/PluginsToolkit";

const { Avatar } = UI;

const MENTION_SENTINEL = "@";

export default class extends TypeAheadResults {
  transformSelectionToText(user) {
    return MENTION_SENTINEL + user.nickname;
  }

  renderHeader() {
    if (this.props.prefix.length > 1) {
      return (
        <div>
          People &amp; Bots matching
          &quot;<strong>{this.props.prefix}</strong>&quot;
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
