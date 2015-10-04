import React from "react";
import { Container } from "flux/utils";
import { Link } from "react-router";

import AccountStore from "../stores/AccountStore";

class Dashboard extends React.Component {
  static getStores() {
    return [ AccountStore ];
  }

  static calculateState(/* prevState */) {
      return {
        accounts: AccountStore.getState()
      };
  }

  render() {
    const accounts = [];
    for (let [name, account] of this.state.accounts) {
      const url = `/chat/${name}/lobby`;
      accounts.push(<div key={name} className="team">
        <div className="name">{name}</div>
        <div className="description">{account.description}</div>
        <div className="actions">
          <a href={url} className="button" target="_blank">Connect</a>
        </div>
      </div>);
    }

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
            {accounts}
          </div>
        </section>
      </section>
    </main>;
  }
}

const DashboardContainer = Container.create(Dashboard);
export default DashboardContainer;
