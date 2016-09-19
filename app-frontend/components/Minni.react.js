import React from "react";
import { Match, Redirect } from "react-router";

import Dashboard from "./DashboardContainer.react";
import DashboardSidebar from "./sidebars/Dashboard.react";

import MultiRoom from "./MutliRoomContainer.react";

import MainSidebar from "./sidebars/MainSidebar.react";

import Lobby from "./LobbyContainer.react";
import RoomCreate from "./RoomCreate.react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";
import SoundPlayer from "./generic/SoundPlayer.react";

import * as AccountActionCreators from "../actions/AccountActionCreators";

class AccountSelector extends React.Component {
  componentWillMount() {
    AccountActionCreators.selectAccount(this.props.params.accountSlug);
  }

  componentWillUpdate(nextProps) {
    AccountActionCreators.selectAccount(nextProps.params.accountSlug);
  }

  render() {
    return null;
  }
}


const App = () => (
  <div className="minni-app flex-horizontal flex-spacer">
    <AccountSwitcher />
    <Match exactly pattern="/" component={DashboardSidebar} />
    <Match exactly pattern="/" component={Dashboard} />

    <Match pattern="/dashboard" component={DashboardSidebar} />
    <Match pattern="/dashboard" component={Dashboard} />

    <Match pattern="/chat/:accountSlug" component={AccountSelector} />
    <Match pattern="/chat/:accountSlug" component={MainSidebar} />

    <Match
      exactly
      pattern={"/chat/:accountSlug"}
      render={({ pathname }) => <Redirect to={`${pathname}/lobby`} />}
    />
    <Match exactly pattern="/chat/:accountSlug/lobby" component={Lobby} />
    <Match exactly pattern="/chat/:accountSlug/create" component={RoomCreate} />
    <Match pattern="/chat/:accountSlug/messages" component={MultiRoom} />


    <SoundPlayer />
  </div>
);

export default App;
