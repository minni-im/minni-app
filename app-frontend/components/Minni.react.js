import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";

class MinniPanel extends React.Component {

  static getStores() {
    return [ AccountStore ];
  }

  static calculateState() {
    return {
      accounts: AccountStore.getState()
    };
  }

  render() {
    const { children } = this.props;
    return <div className="minni-app">
      <AccountSwitcher currentAccount={this.props.params.account} accounts={this.state.accounts}/>
      {children ? children.sidebar : false}
      {React.cloneElement(children.content, {
        currentAccount: this.state.accounts.get(this.props.params.account),
        accounts: this.state.accounts
      })}
    </div>;
  }
}

const MinniPanelContainer = Container.create(MinniPanel);
export default MinniPanelContainer;
