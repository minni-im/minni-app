import Immutable from "immutable";

import { capitalize, slugify } from "../utils/TextUtils";

const AccountRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  description: undefined,
  usersId: [],
  adminId: undefined,
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
