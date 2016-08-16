import Immutable from "immutable";
import React from "react";
import Emoji from "../components/Emoji.react";

const MessageRecord = Immutable.Record({
  id: undefined,
  roomId: undefined,
  user: undefined,
  type: undefined,
  subType: undefined,
  content: undefined,
  contentParsed: undefined,
  embeds: [],
  attachments: [],
  nonce: null,
  dateEdited: null,
  dateCreated: Date.now(),
  lastUpdated: Date.now()
});

export default class Message extends MessageRecord {
  isEdited() {
    return this.dateEdited !== null;
  }

  hasEmbeds() {
    return this.embeds.size > 0;
  }

  // get isEmojiOnly() {
  //   const MAX_EMOJI_JUMBOABLE = 3;
  //   let n = 0;
  //
  //   function checkChildren(children) {
  //     return React.Children.map(
  //       children,
  //       element =>
  //         (typeof element === "string" && element.trim().length === 0) ||
  //         (element.type && typeof element.type === "string" && checkChildren(element.props.children)) ||
  //         (element.type && element.type === Emoji) ||
  //         (n += 1) && n > MAX_EMOJI_JUMBOABLE ||
  //         false
  //     );
  //   }
  //   const map = checkChildren(this.contentParsed[0].props.children);
  //   // console.log(this.content, map);
  //   return map.reduce((final, flag) => final && flag, true);
  // }

  get singleEmbed() {
    return this.embeds.size === 1 &&
      this.content === this.embeds.get(0).get("url") &&
      this.embeds.get(0).get("type") === "image";
  }
}
