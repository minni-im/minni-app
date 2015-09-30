import React from "react";
import { Link } from "react-router";

import UserInfoPanel from "./UserInfoPanel.react";

export default class Minni extends React.Component {
  render() {
    return <div className="minni-app">
      <header>
        <h1>Minni</h1>
        <nav>
          <Link to="/lobby" className="lobby" activeClassName="selected">
            <span className="icon"></span>
            <span className="name">Lobby</span>
          </Link>
          <Link to="/lobby/dashboard" activeClassName="selected">
            <span className="icon"></span>
            <span className="name">Dashboard</span>
          </Link>
        </nav>
        <UserInfoPanel />
      </header>
      {this.props.children}
    </div>;
  }
}
