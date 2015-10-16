import { ReduceStore } from "../libs/flux/Store";
import Dispatcher, { dispatch } from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";
import AccountActionCreators from "../actions/AccountActionCreators";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

const socket = window.io.connect("/");

class ConnectionStore extends ReduceStore {
  initialize() {
    socket.on("connect", () => {
      socket.emit("me:whoami", (me) => {
        socket.emit("accounts:list", ({accounts}) => {
          accounts.forEach(account => {
            AccountActionCreators.fetchUsers(account.id);
            AccountActionCreators.fetchRooms(account.id);
          });
          dispatch({
            type: ActionTypes.CONNECTION_OPEN,
            user: me,
            accounts
          });
        });
      });
    });
  }

  getInitialState() {
    return new Set();
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
