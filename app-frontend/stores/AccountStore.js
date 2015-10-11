import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import { slugify } from "../utils/Text";

import Account from "../models/Account";

class AccountStore extends MapStore {
  getInitialState() {
    let state = Immutable.Map();

    let dataHolder = document.getElementById("data-holder");
    let accounts = JSON.parse(dataHolder.dataset.accounts);

    if (!__DEV__) {
      delete dataHolder.dataset.accounts;
    }

    accounts.forEach(account => {
        state = state.set(slugify(account.name), new Account(account));
        Account.getUsers(account.id);
        Account.getRooms(account.id);
    });

    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case "account/new":
        return addAccount(state, action.account);

      case "account/select":
        return state.map(account => {
          return account.set("active", account.slug === action.account.name);
        });

      default:
        return state;
    }
  }

  hasNoAccount() {
    return this.getState().size === 0;
  }

  get(accountName) {
    accountName = slugify(accountName);
    return this.getState().get(accountName);
  }

  getCurrentAccount() {
    return this.getState().find(account => {
      return account.active;
    });
  }
}

function addAccount(state, accountPayload) {
  let newAccount = new Account(accountPayload);
  return state.set(newAccount.name, newAccount);
}

const instance = new AccountStore(Dispatcher);
export default instance;
