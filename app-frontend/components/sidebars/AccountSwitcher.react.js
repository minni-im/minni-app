import React from "react";
import classnames from "classnames";
import { Container } from "flux/utils";

import { Link } from "react-router";

import AccountStore from "../../stores/AccountStore";

class AccountSwitcher extends React.Component {
  static getStores() {
    return [ AccountStore ];
  }

  static calculateState(/* prevState */) {
    return {
      accounts: AccountStore.getState()
    };
  }

  render() {
    const { accounts } = this.state;
    if (accounts.size === 1) {
      return false;
    }

    let classNames = {
      "account": true
    };

    let links = [];
    accounts.toSeq().forEach(account => {
      links.push(<Link to={`/chat/${account.name}/lobby`} key={account.name}
        className={classnames(classNames, {
          "account-selected": this.props.params.account === account.name
        })}>{account.name.substring(0, 2)}</Link>);
    });

    return <div className="account-switcher">
      {links}
      </div>;
  }
}

const AccountSwitcherContainer = Container.create(AccountSwitcher);
export default AccountSwitcherContainer;
