import Immutable from "immutable";

const MessageRecord = Immutable.Record({
  id: undefined,
  roomId: undefined,
  user: undefined,
  type: undefined,
  subType: undefined,
  content: undefined,
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

  get singleEmbed() {
    return this.embeds.size === 1 &&
      this.content === this.embeds.get(0).get("url") &&
      this.embeds.get(0).get("type") === "image";
  }
}
