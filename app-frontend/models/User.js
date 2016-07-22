import Immutable from "immutable";

import { USER_STATUS } from "../Constants";

const UserRecord = Immutable.Record({
  id: undefined,
  firstname: undefined,
  lastname: undefined,
  fullname: undefined,
  nickname: undefined,
  email: undefined,
  gravatarEmail: undefined,
  picture: "/images/1x1.gif",
  status: USER_STATUS.OFFLINE
});

export default class User extends UserRecord {
  get initials() {
    return (this.firstname[0] + this.lastname[0]).toUpperCase();
  }
}
