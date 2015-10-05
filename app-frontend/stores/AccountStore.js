import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

import Account from "../models/Account";

class AccountStore extends MapStore {
  getInitialState() {
    let state = Immutable.Map();

    let dataHolder = document.getElementById("data-holder");
    let accounts = JSON.parse(dataHolder.dataset.accounts);

    if (!Minni.debug) {
      delete dataHolder.dataset.accounts;
    }

    accounts.forEach(account => {
      state = state.set(account.name, new Account(account));
    });

    return state;
  }

  reduce(state, action) {
    switch (action.type) {
      case "account/new":
        return addAccount(state, action.account);
      default:
        return state;
    }
  }

  hasNoAccount() {
    return this.getState().size === 0;
  }

  get(accountName) {
    return this.getState().get(accountName);
  }
}

function addAccount(state, accountPayload) {
  let newAccount = new Account(accountPayload);
  return state.set(newAccount.name, newAccount);
}

const instance = new AccountStore(Dispatcher);
export default instance;
