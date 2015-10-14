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

  /* STATIC METHODS */

  static getRooms(accountId) {
    fetch(`/api/accounts/${accountId}/rooms`, {
      credentials: "same-origin"
    }).then(response => {
      return response.json();
    }).then(payload => {
      if (payload.ok) {
        const rooms = payload.rooms;
        dispatch({
          type: "rooms/add",
          rooms
        });
      }
    });
  }

  static getUsers(accountId) {
    fetch(`/api/accounts/${accountId}/users`, {
      credentials: "same-origin"
    }).then(response => {
      return response.json();
    }).then(payload => {
      if (payload.ok) {
        const users = payload.users;
        dispatch({
          type: "users/add",
          users
        });
      }
    });
  }
}
