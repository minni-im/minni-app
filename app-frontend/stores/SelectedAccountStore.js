import Immutable from "immutable";
import { ReduceStore } from "../libs/Flux";

import Dispatcher from "../dispatchers/Dispatcher";
import AccountStore from "./AccountStore";

import { ActionTypes } from "../Constants";

import history from "../history";

import Logger from "../libs/Logger";
const logger = Logger.create("SelectedAccountStore");

let selectedAccountSlug;

function handleAccountSelect(state, { accountSlug }) {
  logger.info(`Selecting account from '${state}' => '${accountSlug}'`);
  return accountSlug;
}

class SelectedAccountStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore);
    this.addAction(ActionTypes.ACCOUNT_SELECT, handleAccountSelect);
  }

  getInitialState() {
    // Intentionnaly returning null here.
    return null;
  }

  getState() {
    return selectedAccountSlug;
  }

  areEquals(prev, next) {
    return prev !== next;
  }

  getAccount() {
    return AccountStore.getAccount(selectedAccountSlug);
  }

  getAccountSlug() {
    return selectedAccountSlug;
  }
}

const instance = new SelectedAccountStore(Dispatcher);
export default instance;
