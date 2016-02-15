import React from "react";
import classnames from "classnames";
import { Container } from "flux/utils";

import Platform from "../../utils/PlatformUtils";

import SelectedAccountStore from "../../stores/SelectedAccountStore";
import SelectedRoomStore from "../../stores/SelectedRoomStore";
import AccountStore from "../../stores/AccountStore";
import UserStore from "../../stores/UserStore";

import AccountRecord from "../../models/Account";

import { Link } from "react-router";

class Account extends React.Component {
  render() {
    const { account, selected, keyboardShorcut } = this.props;
    let keyboard = {};
    if (keyboardShorcut) {
      keyboard = {
        "data-kbd-modifier": Platform.isOSX() ? "⌘" : "CTRL",
        "data-kbd-index": this.props.index
      };
    }

    let link = `/chat/${account.name}/lobby`;
    const rooms = SelectedRoomStore.getRooms(account.slug);
    if (rooms.size > 0) {
      link = `/chat/${account.name}/messages/${rooms.join(",")}`;
    }

    return <Link to={link} key={account.name}
      title={account.displayName}
      className={classnames("account", {
        "account-selected": selected
      })} {...keyboard}>
        <div>{account.name[0]}</div>
    </Link>;
  }
}

Account.defaultProps = {
  selected: false,
  keyboardShorcut: false
};

Account.propTypes = {
  account: React.PropTypes.instanceOf(AccountRecord).isRequired,
  index: React.PropTypes.number,
  selected: React.PropTypes.bool,
  keyboardShorcut: React.PropTypes.bool
};

class AccountSwitcher extends React.Component {
  static getStores() {
    return [ AccountStore, SelectedAccountStore ];
  }

  static calculateState() {
    return {
      selectedAccountSlug: SelectedAccountStore.getAccountSlug(),
      accounts: AccountStore.getAccounts()
    };
  }

  render() {
    const { selectedAccountSlug, accounts } = this.state;
    if (!accounts || accounts.size <= 1) {
      return <div className="account-switcher" style={{flexBasis: 0}}></div>;
    }

    let links = accounts.toArray().map((account, index) => {
      return <Account key={account.slug} account={account} keyboardShorcut={true}
        selected={selectedAccountSlug === account.slug} index={index + 1}/>;
    });

    return <div className="account-switcher" style={{flexBasis: "auto"}}>
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

const container = Container.create(AccountSwitcher);
export default container;
