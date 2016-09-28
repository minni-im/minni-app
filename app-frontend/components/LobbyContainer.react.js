import React from "react";
import { Container } from "flux/utils";
import Immutable from "immutable";

import AccountRoomStore from "../stores/AccountRoomStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";
import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";

import Lobby from "./Lobby.react";
import ContactList from "./sidebars/ContactListContainer.react";

class LobbyContainer extends React.Component {
  static getStores() {
    return [
      AccountStore,
      AccountRoomStore,
      SelectedAccountStore
    ];
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
    return (
      <main className="flex-spacer flex-horizontal lobby">
        <Lobby {...this.state} />
        <ContactList />
      </main>
    );
  }
}

const container = Container.create(LobbyContainer);
export default container;
