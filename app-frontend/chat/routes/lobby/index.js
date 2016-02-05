import { deselectRooms } from "../../../utils/RouteUtils";

import Lobby from "./Lobby.react";
import ContactList from "../../components/ContactListContainer.react";

export const Index = {
  onEnter: deselectRooms,
  components: {
    content: Lobby,
    sidebar: ContactList
  }
}

export default Object.assign({
  path: "lobby"
}, Index);
