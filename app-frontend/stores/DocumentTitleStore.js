import Dispatcher from "../Dispatcher";
import { ReduceStore } from "../libs/Flux";
import { ActionTypes, MESSAGE_TYPES } from "../Constants";

import FocusStore from "./FocusStore";
import UnreadMessageStore from "./UnreadMessageStore";

import { capitalize } from "../utils/TextUtils";

const DEFAULT_TITLE = window.Minni.name;
const PATTERN = "#LOCATION#";

const cleanTitle = title => title.replace(/^\(\d+\) (.*)/, "$1");

function handleMessageCreate(state, { message }) {
  const unread = UnreadMessageStore.getTotalUnreadCount();
  if (!FocusStore.isWindowFocused() && unread && message.type === MESSAGE_TYPES.CHAT_MESSAGE) {
    const clean = cleanTitle(state);
    return `(${unread}) ${clean}`;
  }
  return state;
}

function handleWindowFocus(state, { focused }) {
  if (focused) {
    return cleanTitle(state);
  }
  return state;
}

class DocumentTitleStore extends ReduceStore {
  initialize() {
    this.waitFor(FocusStore, UnreadMessageStore);
    this.addAction(ActionTypes.MESSAGE_CREATE, handleMessageCreate);
    this.addAction(ActionTypes.WINDOW_FOCUS, handleWindowFocus);
  }

  getInitialState() {
    return `${PATTERN} • ${DEFAULT_TITLE}`;
  }

  getTitle(text = "") {
    return this.getState().replace(PATTERN, capitalize(text));
  }
}

export default new DocumentTitleStore(Dispatcher);
