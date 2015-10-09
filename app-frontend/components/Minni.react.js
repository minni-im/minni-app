import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";

class MinniPanel extends React.Component {

  static getStores() {
    return [ AccountStore ];
  }

  static calculateState() {
    return {
      currentUser: UserStore.getConnectedUser(),
      accounts: AccountStore.getState()
    };
  }

  render() {
    const { children } = this.props;
    return <div className="minni-app">
      <AccountSwitcher
        currentAccount={this.props.params.account}
        accounts={this.state.accounts}/>
      {children ? children.sidebar : false}
      {React.cloneElement(children.content, {
        currentUser: this.state.currentUser,
        currentAccount: this.state.accounts.get(this.props.params.account),
        accounts: this.state.accounts
      })}
    </div>;
  }
}

const MinniPanelContainer = Container.create(MinniPanel);
export default MinniPanelContainer;
