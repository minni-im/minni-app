import { dispatch } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function togglePreview({ id, roomId }) {
  dispatch({
    type: ActionTypes.MESSAGE_TOGGLE_PREVIEW,
    messageId: id,
    roomId
  });
}
