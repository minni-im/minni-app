import React from "react";
import { Link } from "react-router";
import { Container } from "flux/utils";

import AccountStore from "../../stores/AccountStore";

import { LobbyIcon } from "../../utils/Icons";
import UserInfoPanel from "../UserInfoPanel.react";

class MainSidebar extends React.Component {
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
    const account = this.state.accounts.get(params.account);
    return <header>
      <h1>{Minni.name}</h1>
      <nav>
        <Link to={`/chat/${account.name}/lobby`}
          className="lobby" activeClassName="selected">
          <span className="icon">
            <LobbyIcon />
          </span>
          <span className="name">Lobby</span>
        </Link>
      </nav>
      <UserInfoPanel />
    </header>;
  }
}

const MainSidebarContainer = Container.create(MainSidebar);
export default MainSidebarContainer;