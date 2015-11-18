import Logger from "../libs/Logger";
const logger = Logger.create("RoomActionCreators");
import Dispatcher, { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import ConnectedRoomStore from "../stores/ConnectedRoomStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";

import { createMessage } from "../utils/MessageUtils";

export default {
  joinRoom(accountSlug, roomSlug) {
    roomSlug.forEach(slug => {
      if (!ConnectedRoomStore.isRoomConnected(accountSlug, slug)) {
        dispatch({
          type: ActionTypes.ROOM_JOIN,
          accountSlug,
          roomSlug: slug
        });
      }
    });
  },

  selectRoom(accountSlug, roomSlug) {
    this.joinRoom(accountSlug, roomSlug);
    dispatch({
      type: ActionTypes.ROOM_SELECT,
      accountSlug,
      roomSlug
    });
  },

  deselectRooms() {
    dispatch({
      type: ActionTypes.ROOMS_DESELECT,
      accountSlug: SelectedAccountStore.getAccountSlug(),
      roomSlugs: SelectedRoomStore.getRooms()
    });
  },

  toggleFavorite(roomId, isStarred) {
    dispatch({
      type: isStarred ? ActionTypes.ROOM_UNSTAR : ActionTypes.ROOM_STAR,
      roomId
    });
    const url = isStarred ? EndPoints.ROOM_UNSTAR(roomId) : EndPoints.ROOM_STAR(roomId);
    return request(url, {method: "POST"}).then(({ ok, message, errors }) => {
        if (ok) {
          dispatch({
            type: isStarred ? ActionTypes.ROOM_UNSTAR_SUCCESS : ActionTypes.ROOM_STAR_SUCCESS,
            roomId
          });
        } else {
          logger.error(errors);
          dispatch({
            type: isStarred ? ActionTypes.ROOM_UNSTAR_FAILURE : ActionTypes.ROOM_STAR_FAILURE,
            roomId,
            message
          });
        }
      });
  },

  receiveMessage(roomId, message, optimistic = false) {
    dispatch({
      type: ActionTypes.MESSAGE_CREATE,
      roomId,
      message,
      optimistic
    });
  },

  sendMessage(roomId, text) {
    logger.info(`sending message '${text}' to roomId:${roomId}`);
    const rawMessage = createMessage(roomId, text);
    // Optimistic UI pattern. First display it, then send it to the server
    this.receiveMessage(roomId, rawMessage, true);

    request(EndPoints.MESSAGES, {
      method: "PUT",
      body: Object.assign(rawMessage, {
        nonce: rawMessage.id
      })
    }).then(({ ok, message }) => {
      if (ok) {
        this.receiveMessage(roomId, message);
      } else {
        logger.error(message);
        dispatch({
          type: ActionTypes.MESSAGE_SEND_FAILURE,
          roomId,
          message
        });
      }
    });
  },

  fetchMessages(roomId, latest, oldest, limit) {
    if (!Dispatcher.isDispatching()) {
      dispatch({
        type: ActionTypes.LOAD_MESSAGES,
        roomId
      });
    }
    return request(EndPoints.ROOM_MESSAGES(roomId), {
        params: {
          limit
        }
      })
      .then(({ok, messages, errors}) => {
        if (ok) {
          dispatch({
            type: ActionTypes.LOAD_MESSAGES_SUCCESS,
            roomId,
            messages
          });
        } else {
          dispatch({
            type: ActionTypes.LOAD_MESSAGES_FAILURE,
            roomId,
            errors
          });
        }
      });
  },

  sendTyping(roomId) {
    const { id: accountId } = SelectedAccountStore.getAccount();
    return request(EndPoints.TYPING(roomId), {
      method: "POST",
      body: { accountId }
    });
  }
};
