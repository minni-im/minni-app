import React from "react";
import { Match, Redirect } from "react-router";

import Dashboard from "./DashboardContainer.react";
import DashboardSidebar from "./sidebars/Dashboard.react";

import MultiRoom from "./MutliRoomContainer.react";

import Lobby from "./LobbyContainer.react";
import RoomCreate from "./RoomCreate.react";
import Welcome from "./Welcome.react";

import RouterSessionStart from "./RouterSessionStart.react";
import RouterAccountSelector from "./RouterAccountSelector.react";

import Rooms from "./Rooms.react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";
import SoundPlayer from "./generic/SoundPlayer.react";


const App = () => (
  <div className="minni-app flex-horizontal flex-spacer">
    <AccountSwitcher />
    <Match pattern="/" component={RouterSessionStart} />

    {/* If only one account is available, and url is "/" <Dashboard /> will
          redirect to the corresponding <Lobby /> */}
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
  );

export default App;
