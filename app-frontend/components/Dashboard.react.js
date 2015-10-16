import React from "react";

import { Link } from "react-router";

class Dashboard extends React.Component {
  render() {
    const { accounts } = this.props;
    let list = accounts.toArray().map(account => {
      const url = `/chat/${name}/lobby`;
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

export default Dashboard;
