import React from "react";
import { Container } from "flux/utils";

import AccountHeader from "./AccountHeader.react";
import AccountRooms from "./AccountRooms.react";
import { InfoPanelPopover } from "./UserInfoPanel.react";

import AccountStore from "../stores/AccountStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

class Rooms extends React.Component {
  static getStores() {
    return [SelectedAccountStore, AccountStore];
  }

  static calculateState() {
    return {
      accounts: AccountStore.getAccounts(),
      account: AccountStore.getAccount(SelectedAccountStore.getSlug())
    };
  }

  render() {
    const { account, accounts } = this.state;
    return (
      <header className="flex-vertical">
        <AccountHeader
          className="lobby flex-horizontal"
          account={account}
          hasLogo={accounts && accounts.size === 1}
        />
        {account && <AccountRooms account={account} />}
        <InfoPanelPopover />
      </header>
    );
  }
}

export default Container.create(Rooms);
