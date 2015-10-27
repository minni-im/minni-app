import Long from "long";
import UserStore from "../stores/UserStore";

function createNonce() {
  return Long.fromNumber(new Date().getTime()).multiply(1000.0).subtract(1420070400000).shiftLeft(22);
}

export function createMessage(roomId, content) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    userId: UserStore.getConnectedUser().id
  };
}
