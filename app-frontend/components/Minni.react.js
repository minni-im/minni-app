import React from "react";
import { Link } from "react-router";
import history from "../history";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";
import UserInfoPanel from "./UserInfoPanel.react";

class MinniPanel extends React.Component {
  static getStores() {
    return [ AccountStore ];
  }

  static calculateState(/*prevState*/) {
    return {
      hasAccounts: !AccountStore.hasNoAccount(),
      accounts: AccountStore.getState()
    }
  }

  componentWillMount() {
    if (AccountStore.hasNoAccount()) {
      history.replaceState(null, "/create/account");
    }
  }

  render() {
    return <div className="minni-app">
      {this.state.hasAccounts ? this.renderHeader() : this.renderWelcomeHeader()}
      {this.props.children}
    </div>;
  }

  renderHeader() {
    return <header>
      <h1>Minni</h1>
      <nav>
        <Link to="/lobby" className="lobby" activeClassName="selected">
          <span className="icon"></span>
          <span className="name">Lobby</span>
        </Link>
      </nav>
      <UserInfoPanel />
    </header>;
  }

  renderWelcomeHeader() {
    return <header className="has-no-account">
      <h1>Minni</h1>
      <h2>Welcome to {Minni.name}</h2>
      <p>You are about to setup a new team organisation.</p>
    </header>;
  }
}

const MinniPanelContainer = Container.create(MinniPanel);
export default MinniPanelContainer;
