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

    ACCOUNT_SELECT: null,
    ROOM_SELECT: null,
    ROOMS_SELECT: null,

    ROOM_STAR: null,
    ROOM_UNSTAR: null
  }),

  EndPoints: {
    ACCOUNT_ROOMS: (accountId) => `/api/accounts/${accountId}/rooms`,
    ACCOUNT_USERS: (accountId) => `/api/accounts/${accountId}/users`
  }

};
