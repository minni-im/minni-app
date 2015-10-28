import keyMirror from "keymirror";

export default {
  ActionTypes: keyMirror({
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
    MESSAGE_SEND_FAILURE: null,

    LOAD_MESSAGES: null,
    LOAD_MESSAGES_SUCCESS: null,
    LOAD_MESSAGES_FAILURE: null
  }),

  MAX_MESSAGES_PER_ROOMS: 50,
  MAX_MESSAGE_LENGTH: 2000,

  EndPoints: {
    ACCOUNT_ROOMS: (accountId) => `/api/accounts/${accountId}/rooms`,
    ACCOUNT_USERS: (accountId) => `/api/accounts/${accountId}/users`,
    ROOM_STAR: (roomId) => `/api/rooms/${roomId}/star`,
    ROOM_UNSTAR: (roomId) => `/api/rooms/${roomId}/unstar`,
    ROOM_MESSAGES: (roomId) => `/api/rooms/${roomId}/messages`,
    MESSAGES: `/api/messages/`
  }

};
