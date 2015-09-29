import React from "react";
import { Link } from "react-router";

export default class Dashboard extends React.Component {
  render() {
    return <section className="panel">
      <div>Dashboard</div>
      <div><Link to="/lobby/dashboard">Link to dashboard</Link></div>
    </section>;
  }
}
