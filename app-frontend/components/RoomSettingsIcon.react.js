import React from "react";
import classnames from "classnames";

import RoomSettingsDialog from "./settings/RoomSettingsDialog.react";

import UserStore from "../stores/UserStore";
import { SettingsIcon } from "../utils/IconsUtils";

export default class extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onShowClick = this.onShowClick.bind(this);
  }

  state = {
    visible: false
  }

  onClose() {
    this.setState({ visible: false });
  }

  onShowClick(event) {
    this.setState({ visible: true });
    event.preventDefault();
  }

  render() {
    const { room, className } = this.props;
    if (room.isUserAdmin(UserStore.getConnectedUser().id)) {
      return (
        <span
          className={classnames("icon", className)}
          title="Open settings dialog"
          onClick={this.onShowClick}
        >
          <RoomSettingsDialog
            room={this.props.room}
            visible={this.state.visible}
            onClose={this.onClose}
          />
          <SettingsIcon />
        </span>
      );
    }
    return null;
  }
}
