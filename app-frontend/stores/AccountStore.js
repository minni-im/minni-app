import Immutable from "immutable";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";
import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import { slugify } from "../utils/TextUtils";

import Account from "../models/Account";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountStore");

function handleConnectionOpen(state, { accounts }) {
  state = state.clear().withMutations(map => {
    accounts.forEach(rawAccount => {
      const account = new Account(rawAccount);
      map.set(account.slug, account);
    });
  });
  return state;
}

function handleAccountAdd(state, { account }) {
  let newAccount = new Account(account);
  logger.info("New account", newAccount.slug, account.id);
  return state.set(newAccount.slug, newAccount);
}

class AccountStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction("account/new", handleAccountAdd);
  }

  hasNoAccount() {
    return this.getState().size === 0;
  }

  getById(accountId) {
    return this.getState()
      .toSeq()
      .filter(account => account.id === accountId)
      .first();
  }

  getAccount(accountSlug) {
    return this.get(accountSlug);
  }

  getDefaultAccount() {
    return this.getState().first();
  }

  getAccounts() {
    return this.getState();
  }
}

const instance = new AccountStore(Dispatcher);
export default instance;
