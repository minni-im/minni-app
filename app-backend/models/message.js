import recorder from "@minni-im/tape-recorder";

const MAX_MESSAGES_COUNT = 50;

const MessageSchema = new recorder.Schema({
  dateEdited: String,
  content: String,
  roomId: String,
  userId: String,
  bot: Object,
  type: {
    type: String,
    default: "chat",
  },
  subType: String,
  embeds: {
    type: Array,
    default: [],
  },
});

MessageSchema.method("toAPI", function toAPI() {
  const json = {
    id: this.id,
    roomId: this.roomId,
    userId: this.userId,
    type: this.type,
    bot: this.bot,
    dateEdited: this.dateEdited,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    content: this.content,
    embeds: this.embeds,
  };
  return json;
});

MessageSchema.method("update", function update(text) {
  this.content = text;
  this.embeds = [];
  this.dateEdited = new Date().toISOString();
});

MessageSchema.view("historyByRoomAndDate", {
  map: `function(doc) {
    if (doc.modelType === "Message") {
      emit([doc.roomId, doc.dateCreated], null)
    }
  }`,
});

MessageSchema.static(
  "getHistory",
  function getHistory(
    roomId,
    latest = new Date().toISOString(),
    oldest = 0,
    count = MAX_MESSAGES_COUNT
  ) {
    const range = latest && oldest;
    const options = {
      startkey: [roomId, {}],
      endkey: [roomId, null],
      descending: true,
      limit: count,
    };

    if (range) {
      options.startkey[1] = latest;
      options.endkey[1] = oldest;
      options.inclusive_end = false; // eslint-disable-line camelcase
    } else {
      if (latest) {
        options.startkey[1] = latest;
      }
      if (oldest) {
        options.endkey[1] = oldest;
      }
    }
    return this.where("historyByRoomAndDate", options);
  }
);

export default recorder.model("Message", MessageSchema);
