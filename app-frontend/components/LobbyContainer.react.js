import React from "react";
import { Container } from "flux/utils";
import Immutable from "immutable";
import DocumentTitle from "react-document-title";

import AccountRoomStore from "../stores/AccountRoomStore";
import DocumentTitleStore from "../stores/DocumentTitleStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";
import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";

import Lobby from "./Lobby.react";
import ContactList from "./sidebars/ContactListContainer.react";

class LobbyContainer extends React.Component {
  static getStores() {
    return [AccountStore, AccountRoomStore, SelectedAccountStore, DocumentTitleStore];
  }

  static calculateState() {
    const account = SelectedAccountStore.getAccount();
    const rooms = account
      ? AccountRoomStore.getRooms(account.id, room => -room.lastMsgTimestamp)
      : Immutable.Set();
    return {
      viewer: UserStore.getConnectedUser(),
      account,
      rooms,
      title: DocumentTitleStore.getTitle("lobby"),
    };
  }

  render() {
    const { title, ...otherState } = this.state;
    return (
      <DocumentTitle title={title}>
        <main className="flex-spacer flex-horizontal lobby">
          <Lobby {...otherState} />
          <ContactList />
        </main>
      </DocumentTitle>
    );
  }
}

const container = Container.create(LobbyContainer);
export default container;
