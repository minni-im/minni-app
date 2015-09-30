import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";

class RoomStore extends MapStore {

}

const instance = new RoomStore(Dispatcher);
export default instance;
