import Immutable from "immutable";
import { MapStore } from "../libs/flux/Store";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import { slugify } from "../utils/TextUtils";

import Account from "../models/Account";

import Logger from "../libs/Logger";
const logger = Logger.create("AccountStore");

function handleAccountAdd(state, { account }) {
  let newAccount = new Account(account);
  logger.info("New account", newAccount.slug, account.id);
  return state.set(newAccount.slug, newAccount);
}

class AccountStore extends MapStore {
  initialize() {
    this.addAction("account/new", handleAccountAdd);

    logger.info("loading initial accounts");
    let dataHolder = document.getElementById("data-holder");
    let accounts = JSON.parse(dataHolder.dataset.accounts);

    if (!__DEV__) {
      delete dataHolder.dataset.accounts;
    }

    accounts.forEach(account => {
      dispatch({
        type: "account/new",
        account
      });
      Account.getUsers(account.id);
      Account.getRooms(account.id);
    });
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
}

const instance = new AccountStore(Dispatcher);
export default instance;
