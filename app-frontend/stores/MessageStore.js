import Immutable from "immutable";
import moment from "moment";

import Dispatcher from "../Dispatcher";
import { MapStore } from "../libs/Flux";

import { ActionTypes, MESSAGE_TYPES, MAX_MESSAGES_PER_ROOMS } from "../Constants";

import UserStore from "../stores/UserStore";
import RoomStore from "../stores/RoomStore";

import { parseContent } from "../utils/MarkupUtils";

import Message from "../models/Message";

import Logger from "../libs/Logger";

const logger = Logger.create("MessageStore");

function transformMessage(message) {
  message.dateCreated = moment(new Date(message.dateCreated));
  if (message.lastUpdated) {
    message.lastUpdated = moment(new Date(message.lastUpdated));
  }
  if (message.dateEdited) {
    message.dateEdited = moment(message.dateEdited);
  }

  message.contentParsed = parseContent(message.content, false);

  if (message.type !== MESSAGE_TYPES.SYSTEM_MESSAGE) {
    message.user = UserStore.getUser(message.userId);
    message.embeds = Immutable.fromJS(message.embeds || []);
  }

  return new Message(message);
}

function mergeMessage(messages, message) {
  const newMessage = transformMessage(message);
  const oldMessage = messages.get(message.id);
  if (
    oldMessage == null ||
    oldMessage.content !== newMessage.content ||
    !oldMessage.embeds.equals(newMessage.embeds)
  ) {
    return newMessage;
  }
  return oldMessage;
}

function handleMessageCreate(state, { roomId, message }) {
  let messages = state.get(roomId, Immutable.OrderedMap());
  const nonce = message.nonce;

  if (!messages) {
    return state;
  }
  if (nonce !== null && messages.has(nonce)) {
    delete message.nonce;
    messages = messages.replace(nonce, message.id, transformMessage(message));
  } else {
    // by this time message.id is a nonce
    messages = messages.set(message.id, mergeMessage(messages, message));
  }
  return state.set(roomId, messages);
}

function handleMessageUpdate(state, { message: newMessage }) {
  const { roomId } = newMessage;
  const messages = state.get(roomId);
  if (!messages || !messages.has(newMessage.id)) {
    return state;
  }

  return state.set(
    roomId,
    messages.update(newMessage.id, (message) => {
      if (newMessage.embeds !== message.embeds) {
        message = message.set("embeds", Immutable.fromJS(newMessage.embeds));
      }
      if (newMessage.content !== message.content) {
        message = message
          .set("content", newMessage.content)
          .set("contentParsed", parseContent(newMessage.content, false))
          .set("dateEdited", newMessage.dateEdited);
      }
      return message;
    })
  );
}

function handleLoadMessagesSuccess(state, { roomId, messages: newMessages }) {
  const oldMessages = this.getMessages(roomId);

  const messages = Immutable.OrderedMap().withMutations((map) => {
    newMessages
      .reverse()
      .forEach(message => map.set(message.id, mergeMessage(oldMessages, message)));
    map.merge(oldMessages);
  });

  return state.set(roomId, messages);
}

function handleTruncateMessagesList(state, { roomId, scrollTop }) {
  if (scrollTop === undefined) {
    let messages = state.get(roomId, Immutable.OrderedMap());
    messages = messages.withMutations((map) => {
      while (map.size > MAX_MESSAGES_PER_ROOMS) {
        map.remove(map.first().id);
      }
    });
    return state.set(roomId, messages);
  }
  return state;
}

function handleMessageTogglePreview(state, { messageId, roomId }) {
  const messages = state.get(roomId);

  return state.set(
    roomId,
    messages.update(messageId, message => message.set("preview", !message.preview))
  );
}

class MessageStore extends MapStore {
  initialize() {
    this.waitFor(UserStore, RoomStore);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleMessageCreate);
    this.addAction(ActionTypes.MESSAGE_UPDATE_SUCCESS, handleMessageUpdate);
    this.addAction(ActionTypes.LOAD_MESSAGES_SUCCESS, handleLoadMessagesSuccess);
    this.addAction(ActionTypes.UPDATE_DIMENSIONS, handleTruncateMessagesList);
    this.addAction(ActionTypes.MESSAGE_TOGGLE_PREVIEW, handleMessageTogglePreview);
  }

  getMessages(roomId) {
    return this.getState().get(roomId, Immutable.OrderedMap());
  }

  getLastestMessage(roomId, userId) {
    return this.getMessages(roomId)
      .filter(({ user }) => user && user.id === userId)
      .last();
  }

  hasMessages(roomId) {
    return !this.getMessages(roomId).isEmpty();
  }
}

const instance = new MessageStore(Dispatcher);
export default instance;
