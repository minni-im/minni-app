import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import IdleStore from "./IdleStore";
import AwayStore from "./AwayStore";

function handleStatusUpdate(state, { force }) {
  return state.set("forcedStatus", force === true);
}

function handleWindowFocus(state, { focused }) {
  if (focused && state.get("forcedStatus") === false) {
    ActivityActionCreators.setOnline();
  }
  return state;
}

function handleTypingStart() {
  ActivityActionCreators.setOnline();
}

class PresenceStore extends MapStore {
  initialize() {
    this.waitFor(IdleStore, AwayStore);
    this.addAction(ActionTypes.SET_USER_STATUS, handleStatusUpdate);
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
    this.addAction(ActionTypes.TYPING_START, withNoMutations(handleTypingStart));
  }

  getInitialState() {
    return Immutable.fromJS({ forcedStatus: false });
  }

  isForcedStatus() {
    return this.getState().get("forcedStatus");
  }
}

export default new PresenceStore(Dispatcher);
