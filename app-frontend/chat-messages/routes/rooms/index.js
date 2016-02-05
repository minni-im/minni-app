import { selectRooms } from "../../../utils/RouteUtils";

import Rooms from "./Rooms.react";

export default {
  path: ":roomSlugs",
  onEnter: selectRooms,
  component: Rooms
}
