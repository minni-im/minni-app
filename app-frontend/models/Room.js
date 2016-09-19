import Immutable from "immutable";
import { slugify } from "../utils/TextUtils";

export const TYPE = {
  INITIAL: 0,
  PUBLIC: 1,
  PRIVATE: 2,
  DELETED: 9
};

const RoomRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  topic: "",
  type: TYPE.PUBLIC,
  accountId: undefined,
  adminId: undefined,
  usersId: [],
  lastMsgUserId: undefined,
  lastUpdated: undefined,
  dateCreated: undefined,

  /* UI related properties */
  usersList: true,
  starred: false,
  active: false, // when the associated account is active
  connected: false // when a user joins the room
});

export default class Room extends RoomRecord {
  get private() {
    return this.type === TYPE.PRIVATE;
  }

  get public() {
    return this.type === TYPE.PUBLIC || TYPE.INITIAL;
  }

  get slug() {
    return slugify(this.name);
  }

  isUserAdmin(userId) {
    return userId === this.adminId;
  }
}
