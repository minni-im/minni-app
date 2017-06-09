import React from "react";
import PropTypes from "prop-types";
import { Container } from "flux/utils";
import { NavLink } from "react-router-dom";

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
    className: PropTypes.string,
    withAccountName: PropTypes.bool,
  };

  static defaultProps = {
    className: "",
    withAccountName: true,
  };

  render() {
    const { account } = this.state;
    const { withAccountName } = this.props;
    return (
      <NavLink
        to={`/chat/${account && account.name}/lobby`}
        className={this.props.className}
        activeClassName="selected"
      >
        <span className="icon"><LobbyIcon /></span>
        <span className="name">
          Lobby
          {withAccountName && <span> • {account && account.toString()}</span>}
        </span>
      </NavLink>
    );
  }
}

// TODO: weird side-effect that we have to enforce pure: false to have the
// Link to refresh its activeClassName
export default Container.create(AccountLobbyLink, { pure: false });
