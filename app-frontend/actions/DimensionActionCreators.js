import { dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function updateDimensions(room, dimensions = {}) {
  dispatchAsync(
    Object.assign(
      {
        type: ActionTypes.UPDATE_DIMENSIONS,
        roomId: room.id
      },
      dimensions
    )
  );
}

export function clearDimensions(room) {
  updateDimensions(room, {});
}
