import React from "react";
import { Container } from "flux/utils";

import SelectedAccountStore from "../stores/SelectedAccountStore";
import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";
import UserStore from "../stores/UserStore";

import Lobby from "./Lobby.react";

class LobbyContainer extends React.Component {
  static getStores() {
    return [ SelectedAccountStore, AccountStore, RoomStore ];
  }

  static calculateState() {
    return {
      viewer: UserStore.getConnectedUser(),
      account: SelectedAccountStore.getAccount(),
      rooms: RoomStore.getCurrentRooms()
    };
  }

  render() {
    return <Lobby {...this.state} />;
  }
}

const container = Container.create(LobbyContainer);
export default container;
