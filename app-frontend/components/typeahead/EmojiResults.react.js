import React from "react";
import TypeAheadResults from "./TypeAheadResults.react";
import Emoji from "../Emoji.react";


export const EMOJI_SENTINEL = ":";

export default class EmojiTypeAhead extends TypeAheadResults {
  transformSelectionToText(emoji) {
    return EMOJI_SENTINEL + emoji + EMOJI_SENTINEL;
  }

  renderHeader() {
    return (
      <div>Emojis matching <strong>{this.props.prefix}</strong></div>
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
