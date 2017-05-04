import { dispatchAsync } from "../Dispatcher";
import { ActionTypes } from "../Constants";

import PresenceStore from "../stores/PresenceStore";

export function focus(focused) {
  dispatchAsync({
    type: ActionTypes.WINDOW_FOCUS,
    focused,
    userForcedStatus: PresenceStore.isForcedStatus,
  });
}
