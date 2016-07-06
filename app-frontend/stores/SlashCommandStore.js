import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Logger from "../libs/Logger";
const logger = Logger.create("SlashCommandStore");

function handleQuery(state, { command }) {
  const commandStore = state.get(command, Immutable.Map());
  return state.set(command, commandStore);
}

function handleQuerySuccess(state, { command, query, results }) {
  const commandStore = state.get(command);
  return state.set(command, commandStore.set(query, results));
}

function handleQueryFailure(state) {
  return state;
}

class SlashCommandStore extends MapStore {
  initialize() {
    this.addAction(ActionTypes.SLASHCOMMAND_QUERY, handleQuery);
    this.addAction(ActionTypes.SLASHCOMMAND_QUERY_SUCCESS, handleQuerySuccess);
    this.addAction(ActionTypes.SLASHCOMMAND_QUERY_FAILURE, handleQueryFailure);
  }

  getResults(command, query) {
    return this.getState()
      .get(command, Immutable.Map())
      .get(query, []);
  }
}

const instance = new SlashCommandStore(Dispatcher);
export default instance;
