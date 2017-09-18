import { dispatch, dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import UserStore from "../stores/UserStore";
import MessageStore from "../stores/MessageStore";

export const saveCurrentText = (roomId, text) => {
  dispatchAsync({
    type: ActionTypes.COMPOSER_TEXT_SAVE,
    roomId,
    text,
  });
};

export const editLastMessage = (roomId) => {
  const { id } = UserStore.getConnectedUser();
  const message = MessageStore.getLastestMessage(roomId, id);

  if (message) {
    dispatch({
      type: ActionTypes.MESSAGE_EDIT_START,
      roomId,
      messageId: message.id,
    });
  }
};
