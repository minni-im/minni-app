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
  constructor(props) {
    super({
      id: props.id,
      firstname: props.firstname,
      lastname: props.lastname,
      fullname: props.fullname,
      nickname: props.nickname,
      email: props.email,
      picture: props.picture
    });
  }

  get initials() {
    return (this.firstname[0] + this.lastname[0]).toUpperCase();
  }
}
