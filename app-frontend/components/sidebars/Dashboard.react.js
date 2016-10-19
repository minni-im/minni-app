import React from "react";
import { Link } from "react-router";

const DashboardSidebar = () => (
  <header className="welcome">
    <h1>{Minni.name}</h1>
    <h2>Welcome to {Minni.name}</h2>
    <br />
    <Link to="/create" className="button button-primary">Create new team</Link>
  </header>
);

export default DashboardSidebar;
