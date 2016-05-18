import React from "react";
import { Container } from "flux/utils";

import UserSettingsDialogContainer from "./settings/UserSettingsDialogContainer.react";
import { SettingsIcon } from "../utils/IconsUtils";

import UserStore from "../stores/UserStore";

class UserInfoPanel extends React.Component {
  static getStores() {
    return [UserStore];
  }

  static calculateState() {
    return {
      user: UserStore.getConnectedUser(),
      showSettingsDialog: false
    };
  }

  constructor(props) {
    super(props);
    this.onSettingsClick = this.onSettingsClick.bind(this);
    this.onUserSettingsCloseDialog = this.onUserSettingsCloseDialog.bind(this);
  }

  onSettingsClick(event) {
    event.stopPropagation();
    this.setState({ showSettingsDialog: true });
  }

  onUserSettingsCloseDialog() {
    this.setState({ showSettingsDialog: false });
  }

  render() {
    const { user, showSettingsDialog } = this.state;

    return (
      <div className="user-info flex-horizontal">
        <div className="user flex-horizontal flex-spacer">
          <div className="user-avatar">
            <img src={user.picture} alt="User avatar" />
            <div className="user-status-icon" data-status="2"></div>
          </div>
          <div className="flex-spacer">
            <div className="user-name" title={user.fullname}>{user.fullname}</div>
            <div className="user-status">online</div>
          </div>
        </div>
        <div
          className="user-settings icon"
          onClick={this.onSettingsClick}
        >
          <UserSettingsDialogContainer
            visible={showSettingsDialog}
            onClose={this.onUserSettingsCloseDialog}
          />
          <SettingsIcon />
        </div>
      </div>
    );
  }
}

const UserInfoPanelContainer = Container.create(UserInfoPanel);
export default UserInfoPanelContainer;
