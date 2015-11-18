import RoomActionCreators from "../actions/RoomActionCreators";
import { TYPING_TIMEOUT } from "../Constants";

import SelectedAccountStore from "../stores/SelectedAccountStore";

let currentRoomId;
let nextSendTimestamp;

export default {
  sendTyping(roomId) {
    if (currentRoomId === roomId && nextSendTimestamp > Date.now()) {
      return;
    }
    RoomActionCreators.sendTyping(roomId);
    currentRoomId = roomId;
    nextSendTimestamp = Date.now() + (TYPING_TIMEOUT - 250);
  },

  clearTyping(roomId) {
    if (currentRoomId === roomId) {
      nextSendTimestamp = null;
    }
  }
};
