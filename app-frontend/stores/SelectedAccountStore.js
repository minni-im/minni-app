import Immutable from "immutable";
import { ReduceStore } from "../libs/flux/Store";

import Dispatcher from "../dispatchers/Dispatcher";
import AccountStore from "./AccountStore";

import Logger from "../libs/Logger";
const logger = Logger.create("SelectedAccountStore");


let _state = {
  selectedAccountId: null
};

function handleAccountSelect(state, { account: {id} }) {
  state = Immutable.Set([ id ]);
  return state;
}

class SelectedAccountStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore);
    this.addAction("account/select", handleAccountSelect);
  }

  getInitialState() {
    return Immutable.Set();
  }

  getAccountId() {
    return this.getState().first();
  }

  getAccount() {
    return AccountStore.getById(this.getState().first());
  }
}

const instance = new SelectedAccountStore(Dispatcher);
export default instance;
