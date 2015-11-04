import Immutable from "immutable";
import moment from "moment";

import Dispatcher from "../dispatchers/Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes } from "../Constants";

import UserStore from "../stores/UserStore";
import RoomStore from "../stores/RoomStore";

import Message from "../models/Message";

function transformMessage(message) {
  message.dateCreated = moment(message.dateCreated);
  message.lastUpdated = moment(message.lastUpdated);
  message.user = UserStore.getUser(message.userId);
  return new Message(message);
}

function mergeMessage(messages, message) {
  const newMessage = transformMessage(message);
  const oldMessage = messages.get(message.id);
  if (oldMessage == null || oldMessage.content !== newMessage.content) {
    return newMessage;
  } else {
    return oldMessage;
  }
}

function handleIncomingMessage(state, { roomId, message }) {
  let messages = state.get(roomId, Immutable.OrderedMap());
  const nonce = message.nonce;
  if (nonce !== null && messages.has(nonce)) {
    delete message.nonce;
    messages = messages.replace(nonce, message.id, transformMessage(message));
  } else {
    messages = messages.withMutations(map => {
      map.set(message.id, mergeMessage(map, message));
    });
  }
  return state.set(roomId, messages);
}

function handleLoadMessagesSuccess(state, { roomId, messages: newMessages }) {
  let oldMessages = this.getMessages(roomId);

  let messages = Immutable.OrderedMap().withMutations(map => {
    newMessages.reverse().forEach(message => {
      return map.set(message.id, mergeMessage(oldMessages, message));
    });
  });

  return state.set(roomId, messages);
}

class MessageStore extends MapStore {
  initialize() {
    this.waitFor(UserStore, RoomStore);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleIncomingMessage);
    this.addAction(ActionTypes.LOAD_MESSAGES_SUCCESS, handleLoadMessagesSuccess);
  }

  getMessages(roomId) {
    return this.getState().get(roomId, Immutable.OrderedMap());
  }
}

const instance = new MessageStore(Dispatcher);
export default instance;
