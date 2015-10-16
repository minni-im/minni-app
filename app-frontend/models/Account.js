import Immutable from "immutable";

import { dispatch } from "../dispatchers/Dispatcher";

import { capitalize, slugify } from "../utils/TextUtils";

const AccountRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  description: undefined,
  usersId: [],

  /* UI related properties */
  active: false
});

export default class Account extends AccountRecord {
  get displayName() {
    return capitalize(this.name);
  }

  isUserAdmin(userId) {
    return userId === this.adminId;
  }

  get slug() {
    return slugify(this.name);
  }
}
