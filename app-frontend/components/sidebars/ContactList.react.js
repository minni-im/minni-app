import React from "react";

import UserListContainer from "../UserListContainer.react";

export default class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coworkers: this.props.currentAccount.usersId
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      coworkers: newProps.currentAccount.usersId
    });
  }

  render() {
    const teamSize = this.state.coworkers.length - 1;
    return <aside>
      <header>
        <div className="header-info">
          <h2>Coworkers</h2>
          <h3>{teamSize} teammate{teamSize > 1 ? "s" : ""}</h3>
        </div>
      </header>
      <section className="panel">
        {teamSize ? this.renderList() : this.renderEmptyList()}
      </section>
    </aside>;
  }

  renderList() {
    return <UserListContainer usersId={this.state.coworkers}/>;
  }

  renderEmptyList() {
    return <div className="coworker-all-alone">
      You don't have any coworker ? That is sad !
    </div>;
  }
}
