import recorder from "tape-recorder";

const MAX_MESSAGES_COUNT = 50;

let MessageSchema = new recorder.Schema({
  content: String,
  roomId: String,
  userId: String,
  bot: Object,
  type: {
    type: String
  },
  subType: String,
  meta: {
    type: Object,
    default: {}
  }
});

MessageSchema.method("toAPI", function toAPI() {
  let json = {
    id: this.id,
    roomId: this.roomId,
    userId: this.userId,
    bot: this.bot,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    content: this.content
  };
  if (this.meta) {
    json.meta = this.meta;
  }
  return json;
});

MessageSchema.view("historyByRoomAndDate", {
  map: `function(doc) {
    if (doc.modelType === "Message") {
      emit([doc.roomId, doc.dateCreated], doc)
    }
  }`
});

MessageSchema.static("getHistory", function getHistory(roomId, latest = new Date().toISOString(), oldest = 0, count = MAX_MESSAGES_COUNT) {
  const range = latest && oldest;
  let options = {
    startkey: [roomId, {}],
    endkey: [roomId, null],
    descending: true,
    limit: count
  };

  if (range) {
    options.startkey[1] = latest;
    options.endkey[1] = oldest;
    options.descending = false;
    options.inclusive_end = false;
  } else {
    if (latest) {
      options.startkey[1] = latest;
    }
    if (oldest) {
      options.endkey[1] = oldest;
    }
  }
  return this.where("historyByRoomAndDate", options);
});

export default recorder.model("Message", MessageSchema);
