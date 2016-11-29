import recorder from "tape-recorder";

export const TYPE = {
  INITIAL: 0,
  PUBLIC: 1,
  PRIVATE: 2,
  DELETED: 9
};

const RoomSchema = new recorder.Schema({
  name: String,
  topic: String,
  type: {
    type: Number,
    default: TYPE.PUBLIC
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
      return (
        this.type === TYPE.PUBLIC ||
        this.type === TYPE.INITIAL
      );
    }
  },
  private: {
    get() {
      return this.type === TYPE.PRIVATE;
    }
  }
});

RoomSchema.static("isValidName", function isValidName(accountId, roomName) {
  roomName = roomName.toLowerCase();
  return this.where("accountId", { key: accountId })
    .then(rooms => rooms.filter(({ name }) => name.toLowerCase() === roomName).length === 0);
});

RoomSchema.method("isDefaultRoom", function () {
  return this.type === TYPE.INITIAL;
});

RoomSchema.method("isAdmin", function isAdmin(user) {
  return this.adminId === user.id;
});

RoomSchema.method("isAccessGranted", function isAccessGranted(userId) {
  return this.public || (
    this.private && (
      this.adminId === userId ||
      this.usersId.includes(userId)
    )
  );
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
