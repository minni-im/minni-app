import React from "react";
import { Map } from "immutable";
import { Link } from "react-router";

import Welcome from "./Welcome.react";
import User from "../models/User";

const Dashboard = (props) => {
  const { accounts, user } = props;
  const hello = accounts.isEmpty();

  if (!user) { return null; }
  if (hello) {
    return (
      <Welcome user={user} />
    );
  }

  const list = accounts.toArray().map((account) => {
    const url = `/chat/${account.slug}/lobby`;
    return (
      <div key={account.slug} className="team flex-horizontal">
        <div className="flex-spacer">
          <div className="name">{account.toString()}</div>
          <div className="description">{account.description}</div>
          <div className="members">{
            account.usersId.length > 0 ?
              <span>{account.usersId.length} team member(s)</span> :
              "Seems there is no members in this team"
          }</div>
        </div>
        <div className="actions flex-center">
          <Link
            to={url}
            className="button button-secondary"
          >Open this team</Link>
        </div>
      </div>
    );
  });

  return (
    <main className="dashboard flex-horizontal flex-spacer">
      <section className="flex-spacer flex-center">
        <header>
          <div className="header-info">
            <h2>Dashboard</h2>
            <h3>Your team(s)</h3>
          </div>
        </header>
        <section className="panel panel--contrast panel--wrapper">
          <div className="teams">
            {list}
          </div>
        </section>
      </section>
    </main>
  );
};

Dashboard.propTypes = {
  accounts: React.PropTypes.instanceOf(Map),
  user: React.PropTypes.instanceOf(User)
};

export default Dashboard;
