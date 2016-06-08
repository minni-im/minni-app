import Immutable from "immutable";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import Logger from "../libs/Logger";
const logger = Logger.create("SlashCommandStore");

function handleQuery(state, { command, query }) {
  return state;
}

function handleQuerySuccess(state, { command, query, results }) {
  return state;
}


function handleQueryFailure(state, {}) {
  return state;
}

class SlashCommandStore extends MapStore {
  initialize() {
    this.onAction(ActionTypes.SLASHCOMMAND_QUERY, handleQuery);
    this.onAction(ActionTypes.SLASHCOMMAND_QUERY_SUCCESS, handleQuerySuccess);
    this.onAction(ActionTypes.SLASHCOMMAND_QUERY_FAILURE, handleQueryFailure);
  }

  getResults(command, query) {

  }
}

const instance = new SlashCommandStore(Dispatcher);
export default instance;
