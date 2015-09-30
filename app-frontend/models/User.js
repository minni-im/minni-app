import Immutable from "immutable";

const UserRecord = Immutable.Record({
  id: undefined,
  firstname: undefined,
  lastname: undefined,
  fullname: undefined,
  nickname: undefined,
  email: undefined,
  picture: "/images/1x1.gif",
  status: 0
});

export default class User extends UserRecord {
}
