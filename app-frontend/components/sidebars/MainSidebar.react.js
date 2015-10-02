import React from "react";
import { Link } from "react-router";
import UserInfoPanel from "../UserInfoPanel.react";

export default class MainSidebar extends React.Component {
  render() {
    return <header>
      <h1>{Minni.name}</h1>
      <nav>
        <Link to="/lobby" className="lobby" activeClassName="selected">
          <span className="icon"></span>
          <span className="name">Lobby</span>
        </Link>
      </nav>
      <UserInfoPanel />
    </header>;
  }
}
