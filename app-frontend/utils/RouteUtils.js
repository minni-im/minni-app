import AccountActionCreators from "../actions/AccountActionCreators";
import RoomActionCreators from "../actions/RoomActionCreators";

export function selectAccount({ params: { accountSlug }}) {
  AccountActionCreators.selectAccount(accountSlug);
}

export function deselectAccount() {
  AccountActionCreators.deselectCurrentAccount();
}

export function deselectRooms() {
  RoomActionCreators.deselectRooms();
}

export function selectRooms({ params: { accountSlug, roomSlugs }}, replaceState) {
  roomSlugs = roomSlugs.split(",");
  RoomActionCreators.selectRoom(accountSlug, roomSlugs, false);
}
