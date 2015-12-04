import keyMirror from "keymirror";

export const ActionTypes = keyMirror({
  CONNECTION_START: null,
  CONNECTION_OPEN: null,

  LOAD_USER: null,
  LOAD_USER_SUCCESS: null,
  LOAD_USER_FAILURE: null,

  LOAD_USERS: null,
  LOAD_USERS_SUCCESS: null,
  LOAD_USERS_FAILURE: null,

  LOAD_ROOM: null,
  LOAD_ROOM_SUCCESS: null,
  LOAD_ROOM_FAILURE: null,

  LOAD_ROOMS: null,
  LOAD_ROOMS_SUCCESS: null,
  LOAD_ROOMS_FAILURE: null,

  ACCOUNT_NEW: null,
  ACCOUNT_SELECT: null,
  ACCOUNT_DESELECT: null,

  ROOM_NEW: null,
  ROOM_SELECT: null,
  ROOMS_SELECT: null,
  ROOMS_DESELECT: null,

  ROOM_JOIN: null,
  ROOM_LEAVE: null,

  ROOM_STAR: null,
  ROOM_STAR_SUCCESS: null,
  ROOM_STAR_FAILURE: null,
  ROOM_UNSTAR: null,
  ROOM_UNSTAR_SUCCES: null,
  ROOM_UNSTAR_FAILURE: null,

  COMPOSER_TEXT_SAVE: null,

  MESSAGE_CREATE: null,
  MESSAGE_UPDATE: null,
  MESSAGE_SEND_FAILURE: null,

  LOAD_MESSAGES: null,
  LOAD_MESSAGES_SUCCESS: null,
  LOAD_MESSAGES_FAILURE: null,

  MODAL_PUSH: null,
  MODAL_POP: null,

  TYPING_START: null,
  TYPING_STOP: null,


  LOAD_IMAGE_SUCCESS: null,
  LOAD_IMAGE_FAILURE: null
});

export const AVATAR_SIZES = keyMirror({
  SMALL: null,
  MEDIUM: null,
  LARGE: null
});

export const MessageStreamTypes = keyMirror({
  DIVIDER_TIME_STAMP: null,
  MESSAGE_GROUP: null
});

export const USER_STATUS = {
  OFFLINE: 1 << 0,
  ONLINE: 1 << 1,
  IDLE: 1 << 2,
  AWAY: 1 << 3,
  DND: 1 << 4
};

export const TYPING_TIMEOUT = 5000;

export const MAX_MESSAGES_PER_ROOMS = 50;
export const MAX_MESSAGE_LENGTH = 2000;

export const SOCKETIO_OPTIONS = {
  reconnectionDelay: 1000,
  reconnectionAttempts: 7,
  reconnectionDelayMax: 45000
};

export const MAX_IMAGE_WIDTH = 400;
export const MAX_IMAGE_HEIGHT = 300;

// export const MAX_IMAGE_WIDTH = 1920;
// export const MAX_IMAGE_HEIGHT = 1080;

export const EMBED_OPTIONS = {
  MAX_WIDTH: 400,
  MAX_HEIGHT: 250
};

export const EndPoints = {
  ACCOUNT_ROOMS: (accountId) => `/api/accounts/${accountId}/rooms`,
  ACCOUNT_USERS: (accountId) => `/api/accounts/${accountId}/users`,
  ROOM_STAR: (roomId) => `/api/rooms/${roomId}/star`,
  ROOM_UNSTAR: (roomId) => `/api/rooms/${roomId}/unstar`,
  ROOM_MESSAGES: (roomId) => `/api/rooms/${roomId}/messages`,
  MESSAGES: `/api/messages/`,
  TYPING: roomId => `/api/rooms/${roomId}/typing`
};
