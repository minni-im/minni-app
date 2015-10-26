import Logger from "../libs/Logger";
const logger = Logger.create("RoomActionCreators");
import { dispatch } from "../dispatchers/Dispatcher";
import { ActionTypes, EndPoints } from "../Constants";
import { request } from "../utils/RequestUtils";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";

export default {
  selectRoom(accountSlug, roomSlug) {
    dispatch({
      type: ActionTypes.ROOM_SELECT,
      accountSlug,
      roomSlugs: roomSlug
    });
  },

  selectRooms(accountSlug, roomSlugs) {
    dispatch({
      type: ActionTypes.ROOMS_SELECT,
      accountSlug,
      roomSlugs
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
  }
};
