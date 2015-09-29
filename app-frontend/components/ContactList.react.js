import React from "react";

export default class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      coworkers: []
    };
  }

  render() {
    return <aside>
      <header>
        <div className="header-info">
          <h2>Coworkers</h2>
          <h3>{this.state.coworkers.length} teammate{this.state.coworkers.length ? "s" : ""}</h3>
        </div>
      </header>
      <section className="panel">
        {this.state.coworkers.length ? this.renderList() : this.renderEmptyList()}
      </section>
    </aside>;
  }

  renderList() {
    return <div></div>;
  }

  renderEmptyList() {
    return <div className="coworker-all-alone">
      You don't have any coworker ? That is sad !
    </div>;
  }
}
