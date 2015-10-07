import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";

import { SettingsIcon } from "../utils/Icons";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";

import { camelize } from "../utils/Text";


class Lobby extends React.Component {
  static getStores() {
    return [ AccountStore, RoomStore ];
  }

  static calculateState(/* prevState */) {
    return {
      accounts: AccountStore.getState()
    };
  }

  render() {
    const { children, params } = this.props;
    const account = this.props.accounts.get(params.account);
    return <section>
      <header>
        <div className="header-info">
          <h2>Lobby</h2>
          <h3>{ camelize(account.name) }</h3>
        </div>
        <div className="actions">
          <Link to={`/settings/${account.name}`} title="Settings"
            className="icon" activeClassName="icon--active"><SettingsIcon /></Link>
        </div>
      </header>
      <section className="panel">
        <header>
          <h2>Rooms</h2>
          <div className="actions">
            <Link to={`/chat/${account.name}/create`} className="button">Create a room</Link>
          </div>
        </header>
      </section>
    </section>;
  }
}

const LobbyContainer = Container.create(Lobby);
export default LobbyContainer;
