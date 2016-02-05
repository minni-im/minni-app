import React from "react";
import { Link } from "react-router";

import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";


class Dashboard extends React.Component {
  render() {
    const { accounts } = this.props;
    let list = accounts.toArray().map(account => {
      const url = `/chat/${account.slug}/lobby`;
      return <div key={account.slug} className="team">
        <div className="name">{account.displayName}</div>
        <div className="description">{account.description}</div>
        <div className="actions">
          <a href={url} className="button" target="_blank">Connect</a>
        </div>
      </div>;
    });

    return <main className="dashboard">
      <section>
        <header>
          <div className="header-info">
            <h2>Dashboard</h2>
            <h3>Your team(s)</h3>
          </div>
        </header>
        <section className="panel panel--contrast">
          <div className="teams">
            {list}
          </div>
        </section>
      </section>
    </main>;
  }
}

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
