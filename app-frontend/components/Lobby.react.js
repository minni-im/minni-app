import React from "react";
import { Container } from "flux/utils";

import AccountStore from "../stores/AccountStore";


class Lobby extends React.Component {
  static getStores() {
    return [ AccountStore ];
  }

  static calculateState(/* prevState */) {

    return {
      accounts: AccountStore.getState()
    };
  }

  render() {
    const { children, params } = this.props;
    const account = this.state.accounts.get(this.props.params.account);
    return <section>
      <header>
        <div className="header-info">
          <h2>Lobby</h2>
          <h3>Your «{account.name}» room(s)</h3>
        </div>
      </header>
      <section className="panel">
        Lobby
      </section>
    </section>;
  }
}

const LobbyContainer = Container.create(Lobby);
export default LobbyContainer;
