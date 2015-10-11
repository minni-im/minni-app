import Immutable from "immutable";
import { MapStore } from "flux/utils";

import Dispatcher from "../dispatchers/Dispatcher";
import { dispatch } from "../dispatchers/Dispatcher";

import RoomStore from "./RoomStore";
const CONNECTED_ROOMS = "connectedRooms";

function joinRoom(state, accountSlug, roomId) {
  let connectedRooms = state.get(accountSlug) || Immutable.Set();
  connectedRooms = connectedRooms.add(RoomStore.get(roomId));
  return state.set(accountSlug, connectedRooms);
}

function saveToLocalStorage(accountSlug, roomSlug, remove = false) {
  let list = JSON.parse(localStorage.getItem(CONNECTED_ROOMS)) || {};
  let accountList = list[accountSlug] || (list[accountSlug] = []);
  if (remove) {
    accountList.splice(accountList.indexOf(roomSlug), 1);
  } else {
    if (accountList.indexOf(roomSlug) === -1) {
      accountList.push(roomSlug);
    }
  }
  localStorage.setItem(CONNECTED_ROOMS, JSON.stringify(list));
}

function loadFromLocalStorage() {
  let list = JSON.parse(localStorage.getItem(CONNECTED_ROOMS));
  for (let accountSlug in list) {
    list[accountSlug].forEach(roomSlug => {
      this._state = joinRoom(this.getState(), accountSlug, roomSlug);
    });
  }
}

class ConnectedRoomStore extends MapStore {
  getInitialState() {
    setTimeout(() => {
      dispatch({
        type: "connectedroom/init"
      });
    }, 0);
    return Immutable.Map();
  }

  reduce(state, action) {
    switch (action.type) {
      case "connectedroom/init":
        let list = JSON.parse(localStorage.getItem(CONNECTED_ROOMS));
        for (let accountSlug in list) {
          list[accountSlug].forEach(roomSlug => {
            state = joinRoom(state, accountSlug, roomSlug);
          });
        }
        return state;

      case "account/new":
        return state.set(action.account, Immutable.Set());

      case "room/join":
        this.getDispatcher().waitFor([RoomStore.getDispatchToken()]);

        action.roomIds.forEach(roomId => {
          saveToLocalStorage(action.accountSlug, roomId);
          state = joinRoom(state, action.accountSlug, roomId);
        });
        return state;

      case "room/leave":
        return state;

      default:
        return state;
    }
  }

  getRooms(accountSlug) {
    return this.getState().get(accountSlug) || Immutable.Set();
  }
}

const instance = new ConnectedRoomStore(Dispatcher);
export default instance;
