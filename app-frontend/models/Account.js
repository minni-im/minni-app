import Immutable from "immutable";

import { camelize } from "../utils/Text";

const AccountRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  description: undefined,
  usersId: []
});

export default class Account extends AccountRecord {
  get displayName() {
    return camelize(this.name);
  }
}
