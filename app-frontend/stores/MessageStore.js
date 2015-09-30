import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

class MessageStore extends MapStore {

}

const instance = new MessageStore(Dispatcher);
export default instance;
