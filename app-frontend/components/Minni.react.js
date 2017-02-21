import React from "react";
import { Match, Redirect } from "react-router";
import DocumentTitle from "react-document-title";

import Dashboard from "./DashboardContainer.react";
import DashboardSidebar from "./sidebars/Dashboard.react";

import MultiRoom from "./MutliRoomContainer.react";

import Lobby from "./LobbyContainer.react";
import RoomCreate from "./RoomCreate.react";
import Welcome from "./Welcome.react";

import RouterSessionStart from "./RouterSessionStart.react";
import RouterAccountSelector from "./RouterAccountSelector.react";

import Rooms from "./Rooms.react";

import Notifications from "./Notifications.react";
import AccountSwitcher from "./sidebars/AccountSwitcher.react";
import SoundPlayer from "./generic/SoundPlayer.react";

const App = () => (
  <DocumentTitle title={window.Minni.name}>
    <div className="flex-vertical flex-spacer">
      <Notifications />
      <div className="minni-app flex-horizontal flex-spacer">
        <AccountSwitcher />
        <Match pattern="/" component={RouterSessionStart} />

        <Match exactly pattern="/dashboard" component={DashboardSidebar} />
        <Match exactly pattern="/" component={Dashboard} />
        <Match exactly pattern="/dashboard" component={Dashboard} />

        <Match
          exactly
          pattern="/create"
          render={props => <Welcome explanation={false} {...props} />}
        />

        <Match
          exactly
          pattern={"/chat/:accountSlug"}
          render={({ pathname }) => <Redirect to={`${pathname}/lobby`} />}
        />

        <Match pattern="/chat/:accountSlug" component={RouterAccountSelector} />
        <Match pattern="/chat/:accountSlug" component={Rooms} />

        <Match exactly pattern="/chat/:accountSlug/lobby" component={Lobby} />
        <Match exactly pattern="/chat/:accountSlug/create" component={RoomCreate} />

        <Match pattern="/chat/:accountSlug/messages" component={MultiRoom} />

        <SoundPlayer />
      </div>
    </div>
  </DocumentTitle>
);

export default App;
