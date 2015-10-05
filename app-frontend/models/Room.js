import Immutable from "immutable";

const RoomRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  topic: undefined,
  type: 1,
  adminId: undefined,
  usersId: [],
  lastMsgUserId: undefined
});

export default class Room extends RoomRecord {}
