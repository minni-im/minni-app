import React from "react";
import { Container } from "flux/utils";

import * as ActivityActionCreators from "../actions/ActivityActionCreators";

import UserStatus from "./UserStatus.react";

import Avatar from "./generic/Avatar.react";
import Popover from "./generic/Popover.react";
import UserSettingsDialogContainer from "./settings/UserSettingsDialogContainer.react";

import UserStore from "../stores/UserStore";

import { LogoutIcon, SettingsIcon } from "../utils/IconsUtils";

class UserInfoPanel extends React.Component {
  static getStores() {
    return [UserStore];
  }

  static calculateState() {
    return {
      user: UserStore.getConnectedUser(),
      showSettingsDialog: false,
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
    if (!user) return false;
    return (
      <div className="user-info flex-horizontal">
        <div className="user flex-horizontal flex-spacer">
          <Avatar className="user-avatar" user={user} withStatus />
          <div className="flex-spacer">
            <div className="user-name" title={user.fullname}>{user.fullname}</div>
            <UserStatus status={user.status} />
          </div>
        </div>
        <div className="user-settings icon" onClick={this.onSettingsClick}>
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

const InfoContainer = Container.create(UserInfoPanel);
export default InfoContainer;

export class InfoPanelPopover extends React.Component {
  render() {
    return (
      <Popover
        ref={(popover) => {
          this.popover = popover;
        }}
        className="user-info--popover"
        buttonComponent={<InfoContainer ref={c => (this.infoContainer = c)} />}
      >
        <ul className="menu">
          <li
            rel="link"
            onClick={() => {
              ActivityActionCreators.forceAway();
              this.popover.close();
            }}
          >
            <span className="user-status-icon" data-status="4" />
            Away
          </li>
          <li
            rel="link"
            onClick={() => {
              ActivityActionCreators.forceDnd();
              this.popover.close();
            }}
          >
            <span className="user-status-icon" data-status="5" />
            Do not disturb
          </li>
          <li
            onClick={() => {
              ActivityActionCreators.setOnline();
              this.popover.close();
            }}
          >
            <span className="user-status-icon" data-status="2" />
            Online
          </li>
          <li className="separator" />
          <li>
            <a
              onClick={(evt) => {
                evt.preventDefault();
                this.popover.close();
                this.infoContainer.onSettingsClick(evt);
              }}
            >
              <span className="icon">
                <SettingsIcon />
              </span>
              Settings
            </a>
          </li>
          <li className="separator" />
          <li>
            <a href="/logout">
              <span className="icon">
                <LogoutIcon />
              </span>
              Logout
            </a>
          </li>
        </ul>
      </Popover>
    );
  }
}
