import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import { createHistory } from "history";

import Minni from "./components/Minni.react";
import Lobby from "./components/Lobby.react";
import Dashboard from "./components/Dashboard.react";
import ContactList from "./components/ContactList.react";

React.render((
  <Router history={createHistory()}>
    <Route path="/" component={Minni}>
      <IndexRoute component={Lobby} />
      <Route path="lobby" component={Lobby}>
        <Route path="dashboard" components={{ content: Dashboard, sidebar: ContactList }} />
      </Route>
    </Route>
  </Router>
), document.body);
