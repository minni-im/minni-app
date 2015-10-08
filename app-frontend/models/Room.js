import Immutable from "immutable";

const TYPE = {
  DELETED: 0,
  PUBLIC: 1,
  PRIVATE: 2
};

const RoomRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  topic: "",
  type: TYPE.PUBLIC,
  adminId: undefined,
  usersId: [],
  lastMsgUserId: undefined,
  starred: false
});

export default class Room extends RoomRecord {
  get private() {
    return this.type === TYPE.PRIVATE;
  }

  get public() {
    return this.type === TYPE.PUBLIC;
  }

  isUserAdmin(userId) {
    return userId === this.adminId;
  }
}
