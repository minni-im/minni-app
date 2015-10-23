import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";
import history from "./history";

import Flux from "./libs/Flux";
import { dispatch } from "./dispatchers/Dispatcher";

import Logger from "./libs/Logger";

import { ActionTypes } from "./Constants";

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

import Room from "./components/Room.react";
import RoomMessages from "./components/RoomMessagesContainer.react";

import ConnectionStore from "./stores/ConnectionStore";
import SelectedAccountStore from "./stores/SelectedAccountStore";
import SelectedRoomStore from "./stores/SelectedRoomStore";

function selectAccount(meta, replaceState) {
  const { accountSlug } = meta.params;
  dispatch({
    type: ActionTypes.ACCOUNT_SELECT,
    accountSlug
  });
}

function selectRooms(meta, replaceState) {
  const { accountSlug } = meta.params;
  let roomSlugs = meta.params.roomSlugs.split(",");
  if (roomSlugs.length > 1) {
    return dispatch({
      type: ActionTypes.ROOMS_SELECT,
      accountSlug,
      roomSlugs
    });
  }
  return dispatch({
    type: ActionTypes.ROOM_SELECT,
    accountSlug,
    roomSlugs: roomSlugs
  });
}

function deselectRooms() {
  dispatch({
    type: ActionTypes.ROOMS_DESELECT,
    accountSlug: SelectedAccountStore.getAccountSlug(),
    roomSlugs: SelectedRoomStore.getRooms()
  });
}

Flux.initialize();

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={Minni} >
      <IndexRoute components={{ content: Dashboard, sidebar: DashboardSidebar }} />
      <Route path="create" components={{ content: AccountCreate, sidebar: Welcome }} />
      <Route path="dashboard" components={{ content: Dashboard, sidebar: DashboardSidebar }} />
      <Route path="settings/:accountSlug" components={{ content: Settings, sidebar: MainSidebar }} onEnter={selectAccount} />

      <Route path="chat/:accountSlug" components={{ content: Chat, sidebar: MainSidebar }} onEnter={selectAccount}>
        <IndexRoute components={{content: Lobby, sidebar: ContactList }} />
        <Route path="lobby" components={{content: Lobby, sidebar: ContactList }} />
        <Route path="create" components={{content: RoomCreate, sidebar: ContactList }} />
      </Route>

      <Route path="chat/:accountSlug/messages" components={{content: Room, sidebar: MainSidebar }} onEnter={selectAccount}>
        <Route path=":roomSlugs"
          component={RoomMessages}
          onEnter={selectRooms} onLeave={deselectRooms} />
      </Route>
    </Route>
  </Router>
), document.querySelector("#minni"));
