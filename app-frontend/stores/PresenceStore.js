import Dispatcher from "../Dispatcher";
import { MapStore, withNoMutations } from "../libs/Flux";
import { ActionTypes, USER_STATUS, IDLE_TIMEOUT, AWAY_TIMEOUT } from "../Constants";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import IdleStore from "./IdleStore";
import AwayStore from "./AwayStore";

import Logger from "../libs/Logger";

const logger = Logger.create("PresenceStore");

function handleWindowFocus({ focused }) {
  if (focused) {
    ActivityActionCreators.setOnline();
  }
}

class PresenceStore extends MapStore {
  initialize() {
    this.waitFor(IdleStore, AwayStore);
    this.addAction(ActionTypes.WINDOW_FOCUS, withNoMutations(handleWindowFocus));
  }
}

export default new PresenceStore(Dispatcher);
