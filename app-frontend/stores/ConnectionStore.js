import { ReduceStore, withNoMutations } from "../libs/Flux";
import Dispatcher, { dispatch } from "../dispatchers/Dispatcher";

import { ActionTypes } from "../Constants";

import AccountActionCreators from "../actions/AccountActionCreators";
import RoomActionCreators from "../actions/RoomActionCreators";

import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";

import Logger from "../libs/Logger";
const logger = Logger.create("ConnectionStore");

const socket = window.io.connect("/");
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

socket.on("messages:create", (message) => {
  RoomActionCreators.receiveMessage(message.roomId, message);
});

function handleConnectionOpen() {
  const appHolder = document.querySelector("#minni");
  setTimeout(()=> {
    appHolder.classList.add("fadein");
  }, 1000);
}

class ConnectionStore extends ReduceStore {
  initialize() {
    this.waitFor(AccountStore, UserStore);
    this.addAction(ActionTypes.CONNECTION_OPEN, withNoMutations(handleConnectionOpen));
  }

  getInitialState() {
    return new Set();
  }
}

const instance = new ConnectionStore(Dispatcher);
export default instance;
