import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";

import Dashboard from "./Dashboard.react";

class DashboardContainer extends React.Component {
  static getStores() {
    return [ AccountStore ];
  }

  static calculateState() {
    return {
      accounts: AccountStore.getAccounts()
    };
  }

  render() {
    return <Dashboard accounts={this.state.accounts} />;
  }
}

const container = Container.create(DashboardContainer);
export default container;
