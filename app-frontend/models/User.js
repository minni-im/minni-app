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
  status: USER_STATUS.OFFLINE,
});

export default class User extends UserRecord {
  get initials() {
    if (this.firstname.length && this.lastname.length) {
      return (this.firstname[0] + this.lastname[0]).toUpperCase();
    }
    return this.nickname[0].toUpperCase();
  }

  toString() {
    const name = `${this.firstname}${this.lastname ? ` ${this.lastname}` : ""}`.trim();
    return name.length > 0 ? name : this.nickname;
  }
}
