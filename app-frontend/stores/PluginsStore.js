import Immutable from "immutable";
import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";


function handleRegister(state, { plugin }) {
  return state.update(
    plugin.type,
    Immutable.Set(),
    set => set.add(plugin)
  );
}

class PluginsStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.PLUGIN_REGISTER, handleRegister);
  }

  getPlugins(type) {
    if (type) {
      return this.getState().get(type, Immutable.Set()).toJSON();
    }
    return this.getState().toJSON();
  }
}

export default new PluginsStore(Dispatcher);
