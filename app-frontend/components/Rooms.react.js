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
      account: AccountStore.getAccount(SelectedAccountStore.getSlug()),
    };
  }

  render() {
    const { account, accounts } = this.state;
    const singleAccount = accounts && accounts.size === 1;
    return (
      <header className="flex-vertical">
        <AccountHeader account={account} hasLogo={singleAccount} />
        {account && <AccountRooms account={account} withAccountName={singleAccount} />}
        <InfoPanelPopover />
      </header>
    );
  }
}

export default Container.create(Rooms);
