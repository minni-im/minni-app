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
      account: SelectedAccountStore.getAccount(),
    };
  }

  static propTypes = {
    className: React.PropTypes.string,
    withAccountName: React.PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    withAccountName: true,
  };

  render() {
    const { account } = this.state;
    const { withAccountName } = this.props;
    return (
      <Link
        to={`/chat/${account && account.name}/lobby`}
        className={this.props.className}
        activeClassName="selected"
      >
        <span className="icon"><LobbyIcon /></span>
        <span className="name">
          Lobby
          {withAccountName && <span> • {account && account.toString()}</span>}
        </span>
      </Link>
    );
  }
}

// TODO: weird side-effect that we have to enforce pure: false to have the
// Link to refresh its activeClassName
export default Container.create(AccountLobbyLink, { pure: false });
