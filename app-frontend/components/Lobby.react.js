import React from "react";
import Dashboard from "./Dashboard.react";
import ContactList from "./ContactList.react";

export default class Lobby extends React.Component {
  render() {
    const { children } = this.props;
    return <main className="lobby">
      <section>
        <header>
          <div className="header-info">
            <h2>Lobby</h2>
            <h3>Lobby description</h3>
          </div>
        </header>
        {children ? children.content : <Dashboard />}
      </section>
      {children ? children.sidebar : <ContactList />}
    </main>;
  }
}
