import React from "react";

import ContactList from "./sidebars/ContactList.react";

export default class Lobby extends React.Component {
  render() {
    const { children } = this.props;
    return <main className="lobby">
      <section>
        <header>
          <div className="header-info">
            <h2>Lobby</h2>
            <h3>Your room(s)</h3>
          </div>
        </header>
        <section className="panel">
          Lobby
        </section>
      </section>
      <aside>
        <header>
          <div className="header-info">
            <h2>Coworkers</h2>
            <h3>Teammates</h3>
          </div>
        </header>
      </aside>
    </main>;
  }
}
