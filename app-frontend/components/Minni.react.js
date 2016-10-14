import React from "react";
import { Match, Redirect } from "react-router";

import Dashboard from "./DashboardContainer.react";
import DashboardSidebar from "./sidebars/Dashboard.react";

import CreateOrJoin from "./CreateOrJoin.react";

import MultiRoom from "./MutliRoomContainer.react";

import MainSidebar from "./sidebars/MainSidebar.react";

import Lobby from "./LobbyContainer.react";
import RoomCreate from "./RoomCreate.react";
import Welcome from "./Welcome.react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";
import SoundPlayer from "./generic/SoundPlayer.react";

import { sessionStart } from "../actions/AuthenticationActionCreators";
import * as AccountActionCreators from "../actions/AccountActionCreators";

class AccountSelector extends React.Component {
  componentWillMount() {
    AccountActionCreators.selectAccount(this.props.params.accountSlug);
  }

  componentWillUpdate(nextProps) {
    AccountActionCreators.selectAccount(nextProps.params.accountSlug);
  }

  render() { return null; }
}

class SessionStart extends React.Component {
  componentWillMount() {
    sessionStart();
    const appHolder = document.querySelector("#splashscreen");
    setTimeout(() => {
      document.body.classList.add("loaded");
      setTimeout(() => {
        appHolder.classList.add("splashscreen--hidden");
      }, 500);
    }, 1000);
  }
  render() { return null; }
}


const App = () => (
  <div className="minni-app flex-horizontal flex-spacer">
    <AccountSwitcher />
    <Match pattern="/" component={SessionStart} />

    {/* If only one account is available, and url is "/" <Dashboard /> will
        redirect to the corresponding <Lobby /> */}
    <Match exactly pattern="/(dashboard)?" component={DashboardSidebar} />
    <Match exactly pattern="/(dashboard)?" component={Dashboard} />

    <Match exactly pattern="/create" render={props => <Welcome explanation={false} />} />

    {/*
    <Match pattern="/chat/:accountSlug" component={AccountSelector} />
    <Match pattern="/chat/:accountSlug" component={MainSidebar} />

    <Match
      exactly
      pattern={"/chat/:accountSlug"}
      render={({ pathname }) => <Redirect to={`${pathname}/lobby`} />}
    />
    <Match exactly pattern="/chat/:accountSlug/lobby" component={Lobby} />
    <Match exactly pattern="/chat/:accountSlug/create" component={RoomCreate} />
    <Match pattern="/chat/:accountSlug/messages" component={MultiRoom} /> */}


    <SoundPlayer />
  </div>
);

export default App;
