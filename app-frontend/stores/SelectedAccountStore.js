import { Store } from " flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

import AccountStore from "./AccountStore";

let selectedAccountId = null;

class SelectedAccountStore extends Store {
  __onDispatch(action) {
    this.waitFor([AccountStore.getDispatchToken()]);
    switch (action.type) {
      case "account/select":
        if (action.accountId !== selectedAccountId) {
          selectedAccountId = action.accountId;
          this.__emitChange();
        }
        break;
    }
  }

  getAccountId() {
    return selectedAccountId;
  }
}

const instance = new SelectedAccountStore(Dispatcher);
export default instance;
