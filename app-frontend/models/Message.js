import Immutable from "immutable";

const MessageRecord = Immutable.Record({
  id: undefined,
  roomId: undefined,
  user: undefined,
  type: undefined,
  subType: undefined,
  content: undefined,
  meta: Immutable.Map(),
  attachments: Immutable.List(),
  nonce: null,
  dateCreated: Date.now(),
  lastUpdated: Date.now()
});

export default class Message extends MessageRecord {

}
