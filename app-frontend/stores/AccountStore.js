import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

class AccountStore extends MapStore {

}

const instance = new AccountStore(Dispatcher);
export default instance;
