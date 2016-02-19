import Dispatcher, { dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

export function updateDimensions( room, { scrollTop }) {
  dispatchAsync( ActionTypes.UPDATE_DIMENSIONS , {
    roomId: room.id,
    scrollTop: scrollTop
  } );
};

export function clearDimensions( room ) {
  updateDimensions( room, { scrollTop: null });
};
