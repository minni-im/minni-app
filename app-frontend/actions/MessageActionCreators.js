import { dispatch } from "../Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";
import * as MessageUtils from "../utils/MessageUtils";

import * as RoomActionCreators from "./RoomActionCreators";

import Logger from "../libs/Logger";

const logger = Logger.create("MessageActionCreators");

export function togglePreview({ id, roomId }) {
  dispatch({
    type: ActionTypes.MESSAGE_TOGGLE_PREVIEW,
    messageId: id,
    roomId,
  });
}

export function cancelEdit(roomId, messageId) {
  dispatch({
    type: ActionTypes.MESSAGE_EDIT_STOP,
    roomId,
    messageId,
  });
}

export function sendUpdate(message, text) {
  dispatch({
    type: ActionTypes.MESSAGE_UPDATE,
    message,
    text,
  });

  MessageUtils.updateMessage(message, text).then((patchedMessage) => {
    request(EndPoints.MESSAGE_UPDATE(message.id), {
      method: "PUT",
      body: patchedMessage,
    }).then(({ ok, message: updatedMessage }) => {
      if (ok) {
        const { id, roomId } = updatedMessage;
        RoomActionCreators.updateMessage(roomId, updatedMessage);
        cancelEdit(roomId, id);
      } else {
        logger.error(updatedMessage);
        dispatch({
          type: ActionTypes.MESSAGE_UPDATE_FAILURE,
          roomId: patchedMessage.roomId,
          message: patchedMessage,
        });
      }
    });
  });
}
