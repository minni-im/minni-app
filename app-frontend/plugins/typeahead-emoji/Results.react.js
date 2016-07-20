import React from "react";

import { UI } from "minni-plugins-toolkit";
const { Emoji, TypeaheadResults } = UI;

const EMOJI_SENTINEL = ":";

export default class extends TypeaheadResults {
  static className = "suggestions-emoji";

  transformSelectionToText(emoji) {
    return EMOJI_SENTINEL + emoji + EMOJI_SENTINEL;
  }

  renderHeader() {
    return (
      <div>
        Emojis matching
        &quot;<strong>{this.props.prefix}</strong>&quot;
      </div>
    );
  }

  renderRow(shortname, props) {
    return (
      <div {...props}>
        <Emoji shortname={shortname} />
        {`${EMOJI_SENTINEL}${shortname}${EMOJI_SENTINEL}`}
      </div>
    );
  }
}
