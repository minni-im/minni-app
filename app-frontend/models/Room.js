import Immutable from "immutable";
import RoomActionCreators from "../actions/RoomActionCreators";
import { slugify } from "../utils/TextUtils";

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
  accountId: undefined,
  adminId: undefined,
  usersId: [],
  lastMsgUserId: undefined,

  /* UI related properties */
  usersList: true,
  starred: false,
  active: false, // when the associated account is active
  connected: false // when a user joins the room
});

export default class Room extends RoomRecord {

  // TODO: This constructor is not clean.
  // We should not execute this action in here.
  // Should be moved to a component.
  constructor(props) {
    super(props);
    RoomActionCreators.fetchMessages(this.id);
  }
  get private() {
    return this.type === TYPE.PRIVATE;
  }

  get public() {
    return this.type === TYPE.PUBLIC;
  }

  get slug() {
    return slugify(this.name);
  }

  isUserAdmin(userId) {
    return userId === this.adminId;
  }
}
