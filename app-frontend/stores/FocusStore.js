import Dispatcher from "../Dispatcher";
import { ReduceStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";

function handleWindowFocus(state, { focused }) {
  return focused;
}

class FocusStore extends ReduceStore {
  initialize() {
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
  }

  getInitialState() {
    return true;
  }

  isWindowFocused() {
    return this.getState();
  }
}

export default new FocusStore(Dispatcher);
