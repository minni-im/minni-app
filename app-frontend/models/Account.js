import Immutable from "immutable";

const AccountRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  description: undefined,
  users: []
});

export default class Account extends AccountRecord {
}
