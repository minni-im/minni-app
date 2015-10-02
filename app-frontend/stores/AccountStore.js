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

  hasNoAccount() {
    return this.getState().size === 0;
  }
}

const instance = new AccountStore(Dispatcher);
export default instance;
