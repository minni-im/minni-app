import React from "react";
import { Link } from "react-router";

export default class Minni extends React.Component {
  render() {
    return <div className="minni-app">
      <header>
        <h1>Minni</h1>
        <nav>
          <Link to="/lobby" activeClassName="active">Lobby</Link>
        </nav>
      </header>
      {this.props.children}
    </div>;
  }
}
