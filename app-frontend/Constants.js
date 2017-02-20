/* eslint no-bitwise: ["error", { "allow": ["<<"] }] */
import keyMirror from "keymirror";

export const ActionTypes = keyMirror({
  SESSION_START: null,

  CONNECTION_START: null,
  CONNECTION_OPEN: null,
  CONNECTION_CLOSE: null,

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

  LOAD_INVITATIONS: null,
  LOAD_INVITATIONS_SUCCESS: null,
  LOAD_INVITATIONS_FAILURE: null,

  ACCOUNT_NEW: null,
  ACCOUNT_SELECT: null,
  ACCOUNT_DESELECT: null,

  ACCOUNT_CREATE: null,
  ACCOUNT_CREATE_SUCCESS: null,
  ACCOUNT_CREATE_FAILURE: null,

  ACCOUNT_CHECK_VALID: null,
  ACCOUNT_CHECK_INVALID: null,

  ROOM_NEW: null,
  ROOM_SELECT: null,
  ROOMS_SELECT: null,
  ROOMS_DESELECT: null,

  ROOM_CREATE: null,
  ROOM_CREATE_SUCCESS: null,
  ROOM_CREATE_FAILURE: null,

  ROOM_JOIN: null,
  ROOM_LEAVE: null,

  ROOM_DELETE: null,
  ROOM_DELETE_SUCCESS: null,
  ROOM_DELETE_FAILURE: null,

  ROOM_UPDATE: null,
  ROOM_UPDATE_SUCCESS: null,
  ROOM_UPDATE_FAILURE: null,

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

  MESSAGE_TOGGLE_PREVIEW: null,

  LOAD_MESSAGES: null,
  LOAD_MESSAGES_SUCCESS: null,
  LOAD_MESSAGES_FAILURE: null,

  SETTINGS_UPDATE: null,
  SETTINGS_UPDATE_SUCCESS: null,
  SETTINGS_UPDATE_FAILURE: null,

  PROFILE_UPDATE: null,
  PROFILE_UPDATE_SUCCESS: null,
  PROFILE_UPDATE_FAILURE: null,

  TYPING_START: null,
  TYPING_STOP: null,

  UPDATE_DIMENSIONS: null,

  LOAD_IMAGE_SUCCESS: null,
  LOAD_IMAGE_FAILURE: null,

  SLASHCOMMAND_QUERY: null,
  SLASHCOMMAND_QUERY_SUCCESS: null,
  SLASHCOMMAND_QUERY_FAILURE: null,

  PLUGIN_REGISTER: null,
  PLUGIN_UNREGISTER: null,

  SET_USER_STATUS: null,
  UPDATE_USER_STATUS: null,

  WINDOW_FOCUS: null,

  INVITATION_CREATE: null,
  INVITATION_CREATE_SUCCESS: null,
  INVITATION_CREATE_FAILURE: null,

  INVITATION_ACCEPT: null,
  INVITATION_ACCEPT_SUCCESS: null,
  INVITATION_ACCEPT_FAILURE: null,

  INVITATION_VALIDATE: null,
  INVITATION_VALIDATE_SUCCESS: null,
  INVITATION_VALIDATE_FAILURE: null,

  INVITATION_DELETE: null,
  INVITATION_DELETE_SUCCESS: null,
  INVITATION_DELETE_FAILURE: null,

  NOTIFICATION: null,
  NOTIFICATION_ACK: null,
  NOTIFICATION_ACK_ALL: null,
});

export const NOTIFICATION_ROLES = {
  INFO: "info",
  WARNING: "warn",
  ERROR: "error",
  FATAL: "fatal"
};

export const PLUGIN_TYPES = {
  COMPOSER_TYPEAHEAD: 1 << 0,
  COMPOSER_TEXT: 1 << 1,
  COMPOSER_ACTION: 1 << 2,
  COMPOSER_COMMAND: 1 << 3,
  MESSAGE: 1 << 4
};

export const AVATAR_SIZES = keyMirror({
  SMALL: null,
  MEDIUM: null,
  LARGE: null,
  XLARGE: null
});

export const MessageStreamTypes = keyMirror({
  DIVIDER_TIME_STAMP: null,
  MESSAGE_GROUP: null,
  WELCOME_MESSAGE: null
});

export const USER_STATUS = {
  OFFLINE: 1 << 0,
  CONNECTING: 1 << 1,
  ONLINE: 1 << 2,
  IDLE: 1 << 3,
  AWAY: 1 << 4,
  DND: 1 << 5,
  TYPING: 1 << 6
};

export const USER_STATUS_TEXT = {
  [USER_STATUS.OFFLINE]: "offline",
  [USER_STATUS.CONNECTING]: "connecting...",
  [USER_STATUS.ONLINE]: "online",
  [USER_STATUS.IDLE]: "idle",
  [USER_STATUS.AWAY]: "away",
  [USER_STATUS.DND]: "do not disturb",
};

export const IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes
export const AWAY_TIMEOUT = 5 * 60 * 1000; // 5 minutes after IDLE is fired

export const TYPING_TIMEOUT = 1500;

export const MAX_MESSAGES_PER_ROOMS = 50;
export const MAX_MESSAGE_LENGTH = 2000;
export const FETCH_HISTORY_TRESHOLD = 30;

export const SOCKETIO_OPTIONS = {
  reconnectionDelay: 1000,
  reconnectionAttempts: 7,
  reconnectionDelayMax: 45000,
  randomizationFactor: 0
};

export const MAX_IMAGE_WIDTH = 400;
export const MAX_IMAGE_HEIGHT = 300;

// export const MAX_IMAGE_WIDTH = 1920;
// export const MAX_IMAGE_HEIGHT = 1080;

export const EMBED_OPTIONS = {
  MAX_WIDTH: 400,
  MAX_HEIGHT: 250
};

export const MAX_MULTI_ROOMS = 3;

export const INVITATION_MAX_AGE = 24 * 60 * 60 * 1000;

export const EndPoints = {
  ACCOUNT_CREATE: "/api/accounts/",
  ACCOUNT_CHECK_EXISTENCE:
    name => `/api/accounts/check_existence?name=${name}`,
  ACCOUNT_ROOMS: accountId => `/api/accounts/${accountId}/rooms`,
  ACCOUNT_USERS: accountId => `/api/accounts/${accountId}/users`,
  ROOM_STAR: roomId => `/api/rooms/${roomId}/star`,
  ROOM_UNSTAR: roomId => `/api/rooms/${roomId}/unstar`,
  ROOM_MESSAGES: roomId => `/api/rooms/${roomId}/messages`,
  ROOM_DELETE: roomId => `/api/rooms/${roomId}`,
  ROOM_UPDATE: roomId => `/api/rooms/${roomId}`,
  USER_SETTINGS: "/api/me/settings",
  USER_PROFILE: "/api/me",
  MESSAGES: "/api/messages",
  TYPING: roomId => `/api/rooms/${roomId}/typing`,
  SLASH_COMMAND: "/api/command",
  INVITATION_LIST: accountId => `/api/accounts/${accountId}/invites`,
  INVITATION_CREATE: "/api/invites/",
  INVITATION_VALIDATE: inviteId => `/api/invites/${inviteId}`,
  INVITATION_DELETE: inviteId => `/api/invites/${inviteId}`,
  INVITATION_ACCEPT: inviteId => `/api/invites/${inviteId}`,
};
