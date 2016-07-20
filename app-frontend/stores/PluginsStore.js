import Immutable from "immutable";
import Dispatcher from "../Dispatcher";
import { ReduceStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";


function handleRegister(state, { plugin }) {
  return state.add(plugin);
}

function handleUnregister(state, { plugin }) {
  return state.delete(plugin);
}

class PluginsStore extends ReduceStore {
  initialize() {
    this.addAction(ActionTypes.PLUGIN_REGISTER, handleRegister);
    this.addAction(ActionTypes.PLUGIN_UNREGISTER, handleUnregister);
  }

  getInitialState() {
    return Immutable.Set();
  }

  getPlugins(type) {
    if (type) {
      return this.getState().filter(plugin => plugin.type & type).toJSON();
    }
    return this.getState().toJSON();
  }
}

export default new PluginsStore(Dispatcher);
