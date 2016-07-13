import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

function handleRegister(state, { name, component }) {
  return state.set(name, { name, component });
}

class ComposerPluginsStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.COMPOSER_PLUGIN_REGISTER, handleRegister);
  }

  getPlugins() {
    return this.getState().toJSON();
  }
}

export default new ComposerPluginsStore(Dispatcher);
