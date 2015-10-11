import Immutable from "immutable";

import Settings from "./Settings";
import { DEFAULT_SETTINGS } from "./Settings";

const UserRecord = Immutable.Record({
  id: undefined,
  firstname: undefined,
  lastname: undefined,
  fullname: undefined,
  nickname: undefined,
  email: undefined,
  picture: "/images/1x1.gif",
  status: 0,
  settings: DEFAULT_SETTINGS
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
      picture: props.picture,
      settings: new Settings(Object.assign(DEFAULT_SETTINGS, props.settings))
    });
  }
}
