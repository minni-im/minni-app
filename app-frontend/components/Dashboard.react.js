import React from "react";

import { Link } from "react-router";


class Dashboard extends React.Component {
  render() {
    const accounts = [];
    for (let [name, account] of this.props.accounts) {
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

export default Dashboard;
