import recorder from "tape-recorder";

const TYPE = {
  DELETED: 0,
  PUBLIC: 1,
  PRIVATE: 2
};

let RoomSchema = new recorder.Schema({
  name: String,
  topic: String,
  type: {
    type: Number,
    default: 1
  },
  accountId: String,
  adminId: String,
  usersId: {
    type: Array,
    default: []
  },
  lastMsgUserId: String
});

RoomSchema.virtual({
  public: {
    get() {
      return this.type === TYPE.PUBLIC;
    }
  },
  private: {
    get() {
      return this.type === TYPE.PRIVATE;
    }
  }
});

RoomSchema.method("toAPI", function toAPI(admin = false) {
  return {
    id: this.id,
    name: this.name,
    topic: this.topic,
    type: this.type,
    accountId: this.accountId,
    adminId: this.adminId,
    usersId: this.usersId,
    dateCreated: this.dateCreated,
    lastUpdated: this.lastUpdated,
    lastMsgUserId: this.lastMsgUserId
  };

});

export default recorder.model("Room", RoomSchema);
