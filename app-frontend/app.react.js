import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";

import Flux from "./libs/Flux";
import { dispatch } from "./Dispatcher";

// Patch for Immutable to have replace on OrderedMap
import "./libs/Immutable";

import Logger from "./libs/Logger";

import { ActionTypes } from "./Constants";
import AccountActionCreators from "./actions/AccountActionCreators";
import RoomActionCreators from "./actions/RoomActionCreators";

// import Minni from "./components/Minni.react";
//
// import Welcome from "./components/sidebars/Welcome.react";
// import AccountCreate from "./components/AccountCreate.react";
//
// import Dashboard from "./components/DashboardContainer.react";
// import DashboardSidebar from "./components/sidebars/Dashboard.react";
//
// import Settings from "./components/SettingsContainer.react";
//
// import Chat from "./components/Chat.react";
//
// import Lobby from "./components/LobbyContainer.react";
//
// import MainSidebar from "./components/sidebars/MainSidebar.react";
// import ContactList from "./components/sidebars/ContactListContainer.react";
//
// import RoomCreate from "./components/RoomCreate.react";
//
// import MutliRoomContainer from "./components/MutliRoomContainer.react";
// import Rooms from "./components/RoomsContainer.react";

import routes from "./layout";

import ConnectionStore from "./stores/ConnectionStore";
import SelectedAccountStore from "./stores/SelectedAccountStore";
import SelectedRoomStore from "./stores/SelectedRoomStore";

function selectRooms(meta, replaceState) {
  const { accountSlug } = meta.params;
  let roomSlugs = meta.params.roomSlugs.split(",");
  RoomActionCreators.selectRoom(accountSlug, roomSlugs, false);
}


Flux.initialize();

ReactDOM.render((
  <Router history={browserHistory} routes={routes} />
), document.querySelector("#minni"));
