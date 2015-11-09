import React from "react";
import { Container } from "flux/utils";
import Immutable from "immutable";

import AccountRoomStore from "../stores/AccountRoomStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";
import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import UserStore from "../stores/UserStore";

import Lobby from "./Lobby.react";

class LobbyContainer extends React.Component {
  static getStores() {
    return [ SelectedAccountStore, AccountStore, AccountRoomStore ];
  }

  static calculateState() {
    const account = SelectedAccountStore.getAccount();
    const rooms = account ? AccountRoomStore.getRooms(account.id) : Immutable.Set();
    return {
      viewer: UserStore.getConnectedUser(),
      account,
      rooms
    };
  }

  render() {
    return <Lobby {...this.state} />;
  }
}

const container = Container.create(LobbyContainer);
export default container;
