import Immutable from "immutable";
import { ReduceStore } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";

import AccountStore from "./AccountStore";
import ConnectionStore from "./ConnectionStore";

import { ActionTypes } from "../Constants";

import history from "../history";

import Logger from "../libs/Logger";
const logger = Logger.create("SelectedAccountStore");


function handleAccountSelect(state, { accountSlug }) {
  if (state.has(accountSlug)) {
    return state;
  }
  logger.info(`Selecting account from '${state.first()}' => '${accountSlug}'`);
  state = Immutable.Set([accountSlug]);
  return state;
}

function handleAccountDeselect(state) {
  state = Immutable.Set();
  return state;
}

class SelectedAccountStore extends ReduceStore {
  initialize() {
    this.waitFor(ConnectionStore, AccountStore);
    this.addAction(ActionTypes.ACCOUNT_SELECT, handleAccountSelect);
    this.addAction(ActionTypes.ACCOUNT_DESELECT, handleAccountDeselect);
  }

  getInitialState() {
    return Immutable.Set([null]);
  }

  getAccount() {
    return AccountStore.getAccount(this.getAccountSlug());
  }

  getAccountSlug() {
    return this.getState().first();
  }
}

const instance = new SelectedAccountStore(Dispatcher);
export default instance;
