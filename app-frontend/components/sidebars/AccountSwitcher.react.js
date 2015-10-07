import React from "react";
import classnames from "classnames";

import { Link } from "react-router";

class AccountSwitcher extends React.Component {
  render() {
    const { currentAccount, accounts } = this.props;
    if (!accounts || accounts.size <= 1) {
      return false;
    }

    let classNames = {
      "account": true
    };

    let links = [];
    accounts.toIndexedSeq().forEach((account, index) => {
      links.push(<Link to={`/chat/${account.name}/lobby`} key={account.name}
        title={account.displayName}
        className={classnames(classNames, {
          "account-selected": this.props.currentAccount === account.name
        })}
        data-kbd-modifier="⌘" data-kbd-index={index + 1}>
          <div>{account.name[0]}</div>
        </Link>
      );
    });

    return <div className="account-switcher">
      {links}
      <Link to="/create" className="account create" activeClassName="account-selected">
        <div>+</div>
      </Link>
      <a href="https://minni.im" className="powered-by-minni"
        target="_blank" title="Powered by Minni.im">
        <img src="/images/logo-color.png" />
      </a>
    </div>;
  }
}

export default AccountSwitcher;
