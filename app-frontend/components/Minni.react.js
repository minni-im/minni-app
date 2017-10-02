import React from "react";
import { Route, Redirect } from "react-router-dom";

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
import Lightbox from "./generic/Lightbox.react";
import SoundPlayer from "./generic/SoundPlayer.react";

const App = () => (
  <div className="flex-vertical flex-spacer">
    <Notifications />
    <div className="minni-app flex-horizontal flex-spacer">
      <AccountSwitcher />
      <Route path="/" component={RouterSessionStart} />

      <Route exact path="/dashboard" component={DashboardSidebar} />
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/dashboard" component={Dashboard} />

      <Route exact path="/create" render={props => <Welcome explanation={false} {...props} />} />

      <Route
        exact
        path={"/chat/:accountSlug"}
        render={({ match: { params, url } }) => {
          if (params.accountSlug) {
            return <Redirect to={`${url}/lobby`} />;
          }
          return <Redirect to="/" />;
        }}
      />

      <Route path="/chat/:accountSlug" component={RouterAccountSelector} />
      <Route path="/chat/:accountSlug" component={Rooms} />

      <Route exact path="/chat/:accountSlug/lobby" component={Lobby} />
      <Route exact path="/chat/:accountSlug/create" component={RoomCreate} />

      <Route path="/chat/:accountSlug/messages" component={MultiRoom} />

      <Lightbox />
      <SoundPlayer />
    </div>
  </div>
);

export default App;
