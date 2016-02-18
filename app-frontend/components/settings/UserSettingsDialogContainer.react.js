import React from "react";
import { Container } from "flux/utils";

import UserSettingsDialog from "./UserSettingsDialog.react";

import UserStore from "../../stores/UserStore";
import UserSettingsStore from "../../stores/UserSettingsStore";

class UserSettingsDialogContainer extends React.Component {
  static getStores() {
    return [ UserSettingsStore, UserStore ];
  }

  static calculateState() {
    return {
      user: UserStore.getConnectedUser(),
      settings: UserSettingsStore.getSettings()
    }
  }

  render() {
    return <UserSettingsDialog
      {...this.props}
      settings={ this.state.settings }
      user={ this.state.user } />;
  }
}

const container = Container.create(UserSettingsDialogContainer);
export default container;
