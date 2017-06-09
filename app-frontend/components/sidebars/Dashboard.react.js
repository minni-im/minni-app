import React from "react";
import { Container } from "flux/utils";
import { Link } from "react-router-dom";

import AccountStore from "../../stores/AccountStore";

class DashboardSidebar extends React.Component {
  static getStores() {
    return [AccountStore];
  }

  static calculateState() {
    return {
      render: !AccountStore.getAccounts().isEmpty(),
    };
  }

  render() {
    return (
      this.state.render &&
      <header className="welcome">
        <h1>{Minni.name}</h1>
        <h2>Welcome to {Minni.name}</h2>
        <br />
        <Link to="/create" className="button button-primary">Create new team</Link>
      </header>
    );
  }
}

export default Container.create(DashboardSidebar);
