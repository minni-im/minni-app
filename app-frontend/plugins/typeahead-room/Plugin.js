import UserStore from "../../stores/UserStore";
import SelectedAccountStore from "../../stores/SelectedAccountStore";
import AccountRoomStore from "../../stores/AccountRoomStore";

import { Constants, register as PluginRegister } from "minni-plugins-toolkit";
import ResultsPanel from "./Results.react";

const { COMPOSER_TYPEAHEAD } = Constants.PLUGIN_TYPES;
const SENTINEL = "#";

PluginRegister("RoomTypeahead", COMPOSER_TYPEAHEAD, {
  SENTINEL,
  ResultsPanel,

  reduce(prefix, index, test) {
    if (prefix.length > 3) {
      const user = UserStore.getConnectedUser();
      const connectedAccount = SelectedAccountStore.getAccount();
      const rooms = AccountRoomStore.getRooms(connectedAccount.id);
      return rooms
        .filter(room => test(room.slug))
        .filter((room) => {
          if (room.public) {
            return true;
          }
          if (room.private && (room.usersId.includes(user.id) || room.isUserAdmin(user.id))) {
            return true;
          }
          return false;
        })
        .toArray()
        .slice(0, 10);
    }
    return null;
  }
});
