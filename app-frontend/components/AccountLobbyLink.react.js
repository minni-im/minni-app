import React from "react";
import { Container } from "flux/utils";
import { Link } from "react-router";

import { LobbyIcon } from "../utils/IconsUtils";

import AccountStore from "../stores/AccountStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

class AccountLobbyLink extends React.Component {
  static getStores() {
    return [SelectedAccountStore, AccountStore];
  }

  static calculateState() {
    return {
      account: SelectedAccountStore.getAccount()
    };
  }

  static propTypes = {
    className: React.PropTypes.string
  };

  render() {
    const { account } = this.state;
    return (
      <Link
        to={`/chat/${account && account.name}/lobby`}
        className={this.props.className}
        activeClassName="selected"
      >
        <span className="icon"><LobbyIcon /></span>
        <span className="name">
          Lobby
          <span> • {account && account.toString()}</span>
        </span>
      </Link>
    );
  }
}

// TODO: weird side-effect that we have to enforce pure: false to have the
// Link to refresh its activeClassName
export default Container.create(AccountLobbyLink, { pure: false });
