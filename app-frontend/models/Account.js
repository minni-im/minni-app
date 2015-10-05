import Immutable from "immutable";

const AccountRecord = Immutable.Record({
  id: undefined,
  name: undefined,
  description: undefined,
  usersId: []
});

export default class Account extends AccountRecord {
}
