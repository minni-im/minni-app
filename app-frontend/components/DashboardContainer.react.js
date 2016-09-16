import React from "react";
import { Container } from "flux/utils";

import * as AccountActionCreators from "../actions/AccountActionCreators";
import AccountStore from "../stores/AccountStore";
import UserStore from "../stores/UserStore";
import Dashboard from "./Dashboard.react";

class DashboardContainer extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static getStores() {
    return [AccountStore, UserStore];
  }

  static calculateState() {
    return {
      accounts: AccountStore.getAccounts(),
      user: UserStore.getConnectedUser()
    };
  }

  componentWillUpdate(nextProps, nextState) {
    const { accounts } = nextState;
    if (accounts.size === 1) {
      const account = accounts.first();
      setTimeout(() => {
        this.context.router.transitionTo(`/chat/${account.slug}/lobby`);
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

const container = Container.create(DashboardContainer);
export default container;
