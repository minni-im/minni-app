import React from "react";
import { Container } from "flux/utils";

import ContactList from "./ContactList.react";

import SelectedAccountStore from "../../stores/SelectedAccountStore";
import UserStore from "../../stores/UserStore";

class ContactListContainer extends React.Component {
  static getStores() {
    return [ SelectedAccountStore, UserStore ];
  }

  static calculateState() {
    const viewer = UserStore.getConnectedUser() || {};
    const account = SelectedAccountStore.getAccount() || {};
    return {
      viewer,
      account,
      users: UserStore.getUsers(account.usersId, [ viewer.id ])
    };
  }

  render() {
    return <ContactList {...this.state} />;
  }
}

const instance = Container.create(ContactListContainer);
export default instance;
