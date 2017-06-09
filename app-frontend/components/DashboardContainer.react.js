import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Container } from "flux/utils";

import * as AccountActionCreators from "../actions/AccountActionCreators";
import AccountStore from "../stores/AccountStore";
import ConnectionStore from "../stores/ConnectionStore";
import UserStore from "../stores/UserStore";
import Dashboard from "./Dashboard.react";

class DashboardContainer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  static getStores() {
    return [AccountStore, ConnectionStore, UserStore];
  }

  static calculateState() {
    return {
      accounts: AccountStore.getAccounts(),
      user: UserStore.getConnectedUser(),
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { accounts } = nextState;
    const noRedirect = nextProps.pathname === "/dashboard";
    if (accounts.size === 1 && !noRedirect) {
      const account = accounts.first();
      setTimeout(() => {
        nextProps.history.push(`/chat/${account.slug}/lobby`);
      }, 0);
    }
  }

  componentWillUnmount() {
    AccountActionCreators.deselectCurrentAccount();
  }

  render() {
    return <Dashboard {...this.state} />;
  }
}

const container = Container.create(DashboardContainer, { pure: true });
export default withRouter(container);
