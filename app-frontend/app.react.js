import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";
import history from "./history";

import Minni from "./components/Minni.react";

import Welcome from "./components/sidebars/Welcome.react";
import AccountCreate from "./components/AccountCreate.react";

import Dashboard from "./components/Dashboard.react";
import DashboardSidebar from "./components/sidebars/Dashboard.react";

import Chat from "./components/Chat.react";
import Lobby from "./components/Lobby.react";
import MainSidebar from "./components/sidebars/MainSidebar.react";
import ContactList from "./components/sidebars/ContactList.react";

import AccountStore from "./stores/AccountStore";

/*

path="/" component={Minni} onEnter={DetectNoAccount}

  path="dashboard" component={Dashboard}

  path="create" component={AccountCreate}

  path="chat/:account" component={Chat}

    path="create" component={RoomCreate}

    path="settings" component={Settings}

    path="lobby" component={Lobby}

      path="stats" component={LobbyStatistic}

    component={Room}

      path="messages/:room" component={Message}

      path="files/:room" component={File}

*/
function detectNoAccount(meta, replaceState) {
  if (AccountStore.hasNoAccount() && meta.location.pathname !== "/create") {
    replaceState({ welcome: true }, "/create");
  }
}

function checkAccountExistence(meta, replaceState) {
  if (!AccountStore.get(meta.params.account)) {
    replaceState(null, "/404");
  }
}

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={Minni} onEnter={detectNoAccount}>

      <IndexRoute components={{ content: Dashboard, sidebar: DashboardSidebar }} />

      <Route path="create" components={{ content: AccountCreate, sidebar: Welcome }} />

      <Route path="dashboard" components={{ content: Dashboard, sidebar: DashboardSidebar }} />

      <Route path="chat/:account" components={{ content: Chat, sidebar: MainSidebar }} onEnter={checkAccountExistence}>

        <Route path="lobby" components={{content: Lobby, sidebar: ContactList }} />

      </Route>
    </Route>
  </Router>
), document.body);
