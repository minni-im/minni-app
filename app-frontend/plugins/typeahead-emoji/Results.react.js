import React from "react";
import TypeAheadResults from "../../components/typeahead/TypeAheadResults.react";
import { UI } from "../../libs/PluginsToolkit";

const { Emoji } = UI;

export const EMOJI_SENTINEL = ":";

export default class extends TypeAheadResults {
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
