import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";
import history from "./history";

import Minni from "./components/Minni.react";
import Create from "./components/Create.react";
import AccountCreate from "./components/AccountCreate.react";
import Lobby from "./components/Lobby.react";
import Dashboard from "./components/Dashboard.react";
import ContactList from "./components/sidebars/ContactList.react";

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={Minni}>
      <IndexRoute component={Lobby} />
      <Route component={Create} >
        <Route path="create/account" component={AccountCreate} />
      </Route>
      <Route path="lobby" component={Lobby}>
        <Route path="dashboard" components={{ content: Dashboard, sidebar: ContactList }} />
      </Route>
    </Route>
  </Router>
), document.body);
