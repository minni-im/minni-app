import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import Flux from "./libs/Flux";

// Patch for Immutable to have replace on OrderedMap
import "./libs/Immutable";

import * as AccountActionCreators from "./actions/AccountActionCreators";
import * as RoomActionCreators from "./actions/RoomActionCreators";
import * as WindowActionCreators from "./actions/WindowActionCreators";

import Minni from "./components/Minni.react";

import Welcome from "./components/sidebars/Welcome.react";
import AccountCreate from "./components/AccountCreate.react";

import Dashboard from "./components/DashboardContainer.react";
import DashboardSidebar from "./components/sidebars/Dashboard.react";

import Settings from "./components/SettingsContainer.react";

import Chat from "./components/Chat.react";

import Lobby from "./components/LobbyContainer.react";

import MainSidebar from "./components/sidebars/MainSidebar.react";
import ContactList from "./components/sidebars/ContactListContainer.react";

import RoomCreate from "./components/RoomCreate.react";

import MutliRoomContainer from "./components/MutliRoomContainer.react";
import Rooms from "./components/RoomsContainer.react";

import "./libs/PluginsToolkit";

function selectAccount(meta) {
  AccountActionCreators.selectAccount(meta.params.accountSlug);
}

function selectRooms(meta) {
  const { accountSlug } = meta.params;
  const roomSlugs = meta.params.roomSlugs.split(",");
  RoomActionCreators.selectRoom(accountSlug, roomSlugs, false);
}

function deselectAccount() {
  AccountActionCreators.deselectCurrentAccount();
}

Flux.initialize();

function filterWindowEvent(event, callback) {
  if (event.currentTarget === event.target) {
    callback();
  }
}

window.addEventListener("focus", event =>
  filterWindowEvent(event, () => WindowActionCreators.focus(true)), false);
window.addEventListener("blur", event =>
  filterWindowEvent(event, () => WindowActionCreators.focus(false)), false);

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Minni} >
      <IndexRoute components={{ content: Dashboard, sidebar: DashboardSidebar }} />
      <Route
        path="create"
        components={{ content: AccountCreate, sidebar: Welcome }}
        onEnter={deselectAccount}
      />
      <Route
        path="dashboard"
        components={{ content: Dashboard, sidebar: DashboardSidebar }}
        onEnter={deselectAccount}
      />
      <Route
        path="settings/:accountSlug"
        components={{ content: Settings, sidebar: MainSidebar }}
        onEnter={selectAccount}
      />
      <Route
        path="chat/:accountSlug"
        components={{ content: Chat, sidebar: MainSidebar }}
        onEnter={selectAccount}
      >
        <IndexRoute components={{ content: Lobby, sidebar: ContactList }} />
        <Route
          path="lobby"
          components={{ content: Lobby, sidebar: ContactList }}
          onEnter={RoomActionCreators.deselectRooms}
        />
        <Route
          path="create"
          components={{ content: RoomCreate, sidebar: ContactList }}
        />
      </Route>

      <Route
        path="chat/:accountSlug/messages"
        components={{ content: MutliRoomContainer, sidebar: MainSidebar }}
        onEnter={selectAccount}
      >
        <Route
          path=":roomSlugs"
          component={Rooms}
          onEnter={selectRooms}
        />
      </Route>
    </Route>
  </Router>
), document.querySelector("#minni"));
