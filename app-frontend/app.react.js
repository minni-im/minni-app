import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute } from "react-router";
import history from "./history";

import { dispatch } from "./dispatchers/Dispatcher";

import Minni from "./components/Minni.react";

import Welcome from "./components/sidebars/Welcome.react";
import AccountCreate from "./components/AccountCreate.react";

import Dashboard from "./components/Dashboard.react";
import DashboardSidebar from "./components/sidebars/Dashboard.react";

import Settings from "./components/Settings.react";

import Chat from "./components/Chat.react";
import Lobby from "./components/Lobby.react";
import MainSidebar from "./components/sidebars/MainSidebar.react";
import ContactList from "./components/sidebars/ContactList.react";
import RoomCreate from "./components/RoomCreate.react";

import Room from "./components/Room.react";
import RoomMessagesContainer from "./components/RoomMessagesContainer.react";

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
  const accountName = meta.params.account;
  const account = AccountStore.get(accountName);

  if (account) {
    dispatch({
      type: "account/select",
      account: {
        id: account.id,
        name: accountName
      }
    });
  } else {
    replaceState(null, "/404");
  }
}

function connectRooms(meta, replaceState) {
  dispatch({
    type: "room/join",
    accountSlug: meta.params.account,
    roomIds: meta.params.roomSlug.split(",")
  });
}

const appHolder = document.querySelector("#minni");

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={Minni} onEnter={detectNoAccount}>
      <IndexRoute components={{ content: Dashboard, sidebar: DashboardSidebar }} />
      <Route path="create" components={{ content: AccountCreate, sidebar: Welcome }} />
      <Route path="dashboard" components={{ content: Dashboard, sidebar: DashboardSidebar }} />
      <Route path="settings/:account" components={{ content: Settings, sidebar: MainSidebar }} onEnter={checkAccountExistence} />
      <Route path="chat/:account" components={{ content: Chat, sidebar: MainSidebar }} onEnter={checkAccountExistence}>
        <IndexRoute components={{content: Lobby, sidebar: ContactList }} />
        <Route path="lobby" components={{content: Lobby, sidebar: ContactList }} />
        <Route path="create" components={{content: RoomCreate, sidebar: ContactList }} />
      </Route>
      <Route path="chat/:account/messages" components={{content: Room, sidebar: MainSidebar }} onEnter={checkAccountExistence}>
        <Route path=":roomSlug" component={RoomMessagesContainer} onEnter={connectRooms} />
      </Route>
    </Route>
  </Router>
), appHolder, () => {
  if (__DEV__) {
    appHolder.classList.add("fadein");
  } else {
    setTimeout(() => {
      appHolder.classList.add("fadein");
    }, 1000);
  }
});
