import React from "react";
import { Container } from "flux/utils";

import UserSettingsDialog from "./UserSettingsDialog.react";

import UserStore from "../../stores/UserStore";
import UserSettingsStore from "../../stores/UserSettingsStore";

import { updateSettings } from "../../actions/SettingsActionCreators";
import { updateProfile } from "../../actions/UserActionCreators";

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

  constructor(props) {
    super(props);
    this.onCloseDialog = this.onCloseDialog.bind(this);
  }

  render() {
    return <UserSettingsDialog
      {...this.props}
      onClose={ this.onCloseDialog }
      settings={ this.state.settings }
      user={ this.state.user } />;
  }

  onCloseDialog( action, { settings, userInfo }) {
    if ( action === "save" ) {
      const actions = [];
      if ( settings ) {
        actions.push( updateSettings( settings ) );
      }
      if ( userInfo ) {
        actions.push( updateProfile( userInfo ) );
      }

      if ( actions.length ) {
        Promise.all(actions).then( () => {
          this.props.onClose(action);
        } );
        return;
      }
    }
    this.props.onClose(action);
  }
}

const container = Container.create(UserSettingsDialogContainer);
export default container;
