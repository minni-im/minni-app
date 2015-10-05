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
    if (accounts.size <= 1) {
      return false;
    }

    let classNames = {
      "account": true
    };

    let links = [];
    accounts.toIndexedSeq().forEach((account, index) => {
      links.push(<Link to={`/chat/${account.name}/lobby`} key={account.name} title={account.name}
        data-kbd-modifier="⌘" data-kbd-index={index + 1}>
          <div className={classnames(classNames, {
            "account-selected": this.props.params.account === account.name
            })}>{account.name[0]}</div>
        </Link>
      );
    });

    return <div className="account-switcher">
      {links}
      <Link to="/create" className="create">
        <div className="account">+</div>
      </Link>
    </div>;
  }
}

const AccountSwitcherContainer = Container.create(AccountSwitcher);
export default AccountSwitcherContainer;
