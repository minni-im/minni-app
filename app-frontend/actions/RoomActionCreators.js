import { dispatch, dispatchAsync } from "../Dispatcher";
import { ActionTypes, EndPoints, MAX_MESSAGES_PER_ROOMS } from "../Constants";
import { request } from "../utils/RequestUtils";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";
import MessageStore from "../stores/MessageStore";
import UserStore from "../stores/UserStore";

import * as MessageUtils from "../utils/MessageUtils";

import Logger from "../libs/Logger";

const logger = Logger.create("RoomActionCreators");

export function fetchMessages(roomId, latest, oldest = null, limit = MAX_MESSAGES_PER_ROOMS) {
  dispatchAsync({
    type: ActionTypes.LOAD_MESSAGES,
    roomId,
  });

  const params = {
    limit,
  };
  if (latest) {
    params.latest = latest;
  }
  if (oldest) {
    params.oldest = oldest;
  }

  return request(EndPoints.ROOM_MESSAGES(roomId), {
    params,
  }).then(
    ({ ok, messages, errors }) => {
      if (ok) {
        dispatch({
          type: ActionTypes.LOAD_MESSAGES_SUCCESS,
          roomId,
          messages,
          limit,
        });
      } else {
        dispatch({
          type: ActionTypes.LOAD_MESSAGES_FAILURE,
          roomId,
          errors,
        });
      }
    },
    (errors) => {
      dispatch({
        type: ActionTypes.LOAD_MESSAGES_FAILURE,
        roomId,
        errors,
      });
    }
  );
}

function fetchMessagesIfNeeded(roomId) {
  const hasMessages = MessageStore.hasMessages(roomId);
  if (hasMessages) {
    return Promise.resolve();
  }
  return fetchMessages(roomId);
}

export function joinRoom(accountSlug, roomSlug) {
  roomSlug.forEach((slug) => {
    if (!ConnectedRoomStore.isRoomConnected(accountSlug, slug)) {
      dispatch({
        type: ActionTypes.ROOM_JOIN,
        accountSlug,
        roomSlug: slug,
      });
    }
  });
}

export function leaveRoom(accountSlug, roomSlug) {
  if (ConnectedRoomStore.isRoomConnected(accountSlug, roomSlug)) {
    dispatch({
      type: ActionTypes.ROOM_LEAVE,
      accountSlug,
      roomSlug,
    });
  }
}

export function selectRoom(accountSlug, roomSlug) {
  joinRoom(accountSlug, roomSlug);
  dispatch({
    type: ActionTypes.ROOM_SELECT,
    accountSlug,
    roomSlug,
  });
}

export function deselectRooms() {
  dispatch({
    type: ActionTypes.ROOMS_DESELECT,
    accountSlug: SelectedAccountStore.getSlug(),
    roomSlugs: SelectedRoomStore.getRooms(),
  });
}

export function toggleFavorite(roomId, isStarred) {
  dispatch({
    type: isStarred ? ActionTypes.ROOM_UNSTAR : ActionTypes.ROOM_STAR,
    roomId,
  });
  const url = isStarred ? EndPoints.ROOM_UNSTAR(roomId) : EndPoints.ROOM_STAR(roomId);
  return request(url, { method: "POST" }).then(({ ok, message, errors }) => {
    if (ok) {
      dispatch({
        type: isStarred ? ActionTypes.ROOM_UNSTAR_SUCCESS : ActionTypes.ROOM_STAR_SUCCESS,
        roomId,
      });
    } else {
      logger.error(errors);
      dispatch({
        type: isStarred ? ActionTypes.ROOM_UNSTAR_FAILURE : ActionTypes.ROOM_STAR_FAILURE,
        roomId,
        message,
      });
    }
  });
}

export function receiveMessage(roomId, message, optimistic = false) {
  Promise.all([
    fetchMessagesIfNeeded(roomId),
    MessageUtils.receiveMessage(roomId, message, optimistic),
    // eslint-disable-next-line no-unused-vars
  ]).then(([_, processedMessage]) => {
    dispatch({
      type: ActionTypes.MESSAGE_CREATE,
      roomId,
      message: processedMessage,
      optimistic,
    });
  });
}

export function updateMessage(roomId, message) {
  dispatch({
    type: ActionTypes.MESSAGE_UPDATE_SUCCESS,
    roomId,
    message,
  });
}

export function sendMessage(roomId, text) {
  logger.info(`sending message '${text}' to roomId:${roomId}`);
  MessageUtils.createMessage(roomId, text).then(
    (rawMessage) => {
      // Optimistic UI pattern. First display it, then send it to the server
      receiveMessage(roomId, { ...rawMessage }, true);

      request(EndPoints.MESSAGES, {
        method: "POST",
        body: Object.assign(rawMessage, {
          nonce: rawMessage.id,
        }),
      }).then(({ ok, message }) => {
        if (ok) {
          receiveMessage(roomId, message);
        } else {
          logger.error(message);
          dispatch({
            type: ActionTypes.MESSAGE_SEND_FAILURE,
            roomId,
            message,
          });
        }
      });
    },
    (error) => {
      logger.error(error);
    }
  );
}

export function sendTyping(roomId) {
  const { id: accountId } = SelectedAccountStore.getAccount();
  request(EndPoints.TYPING(roomId), {
    method: "POST",
    body: { accountId },
  });
}

export function roomDeleted(room) {
  dispatch({
    type: ActionTypes.ROOM_DELETE_SUCCESS,
    room,
  });
}

export function deleteRoom(roomId) {
  dispatch({
    type: ActionTypes.ROOM_DELETE,
    roomId,
  });
  return request(EndPoints.ROOM_DELETE(roomId), {
    method: "DELETE",
  }).then(({ ok, room, errors }) => {
    if (ok) {
      roomDeleted(room);
      return { ok, room };
    }
    dispatch({
      type: ActionTypes.ROOM_DELETE_FAILURE,
      room,
    });
    return { ok, room, errors };
  });
}

export function updateRoom(roomId, payload) {
  dispatch({
    type: ActionTypes.ROOM_UPDATE,
    roomId,
  });
  return request(EndPoints.ROOM_UPDATE(roomId), {
    method: "POST",
    body: payload,
  }).then(({ ok, room, errors }) => {
    if (ok) {
      dispatch({
        type: ActionTypes.ROOM_UPDATE_SUCCESS,
        room,
      });
      return { ok, room };
    }
    dispatch({
      type: ActionTypes.ROOM_UPDATE_FAILURE,
      room,
    });
    return { ok, room, errors };
  });
}

export function notifyUserJoin(roomId, userId) {
  fetchMessagesIfNeeded(roomId).then(() => {
    const user = UserStore.getUser(userId);
    const message = MessageUtils.createSystemMessage(
      roomId,
      `${user} joined the conversation`,
      "join"
    );
    dispatch({
      type: ActionTypes.MESSAGE_CREATE,
      roomId,
      message,
    });
  });
}

export function notifyUserLeave(roomId, userId) {
  fetchMessagesIfNeeded(roomId).then(() => {
    const user = UserStore.getUser(userId);
    const message = MessageUtils.createSystemMessage(
      roomId,
      `${user} left the conversation`,
      "leave"
    );

    dispatch({
      type: ActionTypes.MESSAGE_CREATE,
      roomId,
      message,
    });
  });
}
