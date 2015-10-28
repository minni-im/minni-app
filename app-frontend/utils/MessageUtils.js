import Long from "long";
import UserStore from "../stores/UserStore";

function createNonce() {
  return Long.fromNumber(new Date().getTime()).multiply(1000.0).subtract(1420070400000).shiftLeft(22);
}

export function createMessage(roomId, content, subType) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    type: "chat",
    userId: UserStore.getConnectedUser().id
  };
}

export function createSystemMessage(roomId, content, subType) {
  return {
    id: createNonce().toString(),
    roomId,
    content,
    type: "system",
    subType: subType,
    userId: UserStore.getConnectedUser().id
  };
}
