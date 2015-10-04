import React from "react";
import { Link } from "react-router";

export default class DashboardSidebar extends React.Component {
  render() {
    return <header className="welcome">
      <h1>{Minni.name}</h1>
      <h2>Welcome to {Minni.name}</h2>
      <Link to="/create" className="button">Create a new team</Link>
    </header>;
  }
}
