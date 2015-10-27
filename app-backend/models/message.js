import recorder from "tape-recorder";

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

export default recorder.model("Message", MessageSchema);
