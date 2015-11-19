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

  get hasEmbeds() {
    return this.embeds.length > 0;
  }
}
