import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";
import RoomStore from "../stores/RoomStore";



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
          <h3>Your « {account.name} » room(s)</h3>
        </div>
      </header>
      <section className="panel">
        <h2>Rooms</h2>

      </section>
    </section>;
  }
}

const LobbyContainer = Container.create(Lobby);
export default LobbyContainer;
