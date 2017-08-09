import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";
import { ActionTypes } from "../Constants";
import moment from "moment";

import MessageStore from "./MessageStore";

function handleMessageUpdate(state, { message }) {
  const { roomId } = message;
  return state.set(roomId, {
    lastMsgTimestamp: moment(message.lastUpdated).unix(),
    lastMsgUserId: message.user.id,
  });
}

function handleConnectionOpen(state, { rooms }) {
  return state.withMutations((map) => {
    rooms.forEach((room) => {
      console.log(room.name, room.lastMsgTimestamp);
      if (room.lastMsgTimestamp && room.lastMsgUserId) {
        map.set(room.id, {
          lastMsgTimestamp: moment(room.lastMsgTimestamp).unix(),
          lastMsgUserId: room.lastMsgUserId,
        });
      }
    });
  });
}

// function handleLoadMessagesSuccess(state, { roomId, messages }) {
//   if (messages.length === 0) {
//     return state;
//   }
//   const { lastUpdated, user } = messages[messages.length - 1];
//   return state.set(roomId, {
//     lastMsgTimestamp: moment(lastUpdated).unix(),
//     lastMsgUserId: user.id,
//   });
// }

class RoomStateStore extends MapStore {
  initialize() {
    this.waitFor(MessageStore);
    this.addAction(ActionTypes.CONNECTION_OPEN, handleConnectionOpen);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleMessageUpdate);
    this.addAction(ActionTypes.MESSAGE_UPDATE, handleMessageUpdate);
    // this.addAction(ActionTypes.LOAD_MESSAGES_SUCCESS, handleLoadMessagesSuccess);
  }

  getLastMessageInfo(roomId) {
    return this.getState().get(roomId, false);
  }
}

export default new RoomStateStore(Dispatcher);
