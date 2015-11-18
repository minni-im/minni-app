import React from "react";

import UserList from "../UserList.react";

import Logger from "../../libs/Logger";
const logger = Logger.create("ContactList");

export default class ContactList extends React.Component {
  render() {
    const teamSize = this.props.users.size;
    return <aside>
      <header>
        <div className="header-info">
          <h2>Coworkers</h2>
          <h3>{teamSize} teammate{teamSize > 1 ? "s" : ""}</h3>
        </div>
      </header>
      <section className="panel panel--wrapper">
        {teamSize ? this.renderList() : this.renderEmptyList()}
      </section>
    </aside>;
  }

  renderList() {
    return <UserList viewer={this.props.viewer} users={this.props.users}/>;
  }

  renderEmptyList() {
    return <div className="coworker-all-alone">
      You don't have any coworker ? That is sad !
    </div>;
  }
}
