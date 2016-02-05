import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

function handleRegister(state, { name, component }) {
  return state.set(name, { name, component });
}

class TypeAheadStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.TYPEAHEAD_REGISTER, handleRegister);
  }
}

export default new TypeAheadStore(Dispatcher);
