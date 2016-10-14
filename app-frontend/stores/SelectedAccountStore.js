import Immutable from "immutable";
import { ReduceStore } from "../libs/Flux";

import Dispatcher from "../Dispatcher";

import AccountStore from "./AccountStore";
import ConnectionStore from "./ConnectionStore";
import UserStore from "./UserStore";

import { ActionTypes } from "../Constants";
import Logger from "../libs/Logger";

const logger = Logger.create("SelectedAccountStore");


function handleAccountSelect(state, { accountSlug }) {
  if (state === accountSlug) {
    return state;
  }
  logger.info(`Selecting account from '${state}' => '${accountSlug}'`);
  return accountSlug;
}

function handleAccountDeselect() {
  return null;
}

class SelectedAccountStore extends ReduceStore {
  initialize() {
    this.waitFor(ConnectionStore, AccountStore);
    this.addAction(ActionTypes.ACCOUNT_SELECT, handleAccountSelect);
    this.addAction(ActionTypes.ACCOUNT_DESELECT, handleAccountDeselect);
  }

  getInitialState() {
    return null;
  }

  getAccount() {
    return AccountStore.getAccount(this.getSlug());
  }

  getSlug() {
    return this.getState();
  }

  getUsers(except) {
    return UserStore.getUsers((this.getAccount() && this.getAccount().usersId) || [], except);
  }
}

const instance = new SelectedAccountStore(Dispatcher);
export default instance;
