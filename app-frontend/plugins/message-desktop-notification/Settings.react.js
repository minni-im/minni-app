import React, { Component, PropTypes } from "react";
import { Stores, UI } from "minni-plugins-toolkit";

const { SettingsStore } = Stores;
const { SettingItem } = UI;

export const SETTING_KEY = "global.notification.desktop";
export const NOTIFICATION_GRANTED = "granted";

export function checkPermission() {
  if (window.Notification && window.Notification.permission) {
    return window.Notification.permission;
  }
  return false;
}

function grantPermission(callback) {
  window.Notification.requestPermission(permission =>
    callback(permission === NOTIFICATION_GRANTED, permission));
}


export default class Settings extends Component {
  static category = "notifications"
  static prepend = true

  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onActivateChange = this.onActivateChange.bind(this);
    this.onGrantNotificationClick = this.onGrantNotificationClick.bind(this);
  }

  state = {
    active: SettingsStore.getValue(SETTING_KEY, false),
    notifGranted: checkPermission() === NOTIFICATION_GRANTED
  }

  onActivateChange(key, newValue) {
    this.props.onChange(key, newValue);
  }

  onGrantNotificationClick() {
    grantPermission((granted) => {
      this.setState({
        notifGranted: granted
      });
      this.onActivateChange(SETTING_KEY, granted);
    });
  }

  render() {
    return (
      <section className="desktop-notifications">
        <h3>Desktop Notifications</h3>
        {this.state.notifGranted ?
          <SettingItem
            setting={SETTING_KEY}
            default={isNaN(NaN)}
            title="Use the native broswer's or operating system ability to display desktop notifications."
            onChange={this.onActivateChange}
          /> :
          (<div className="setting-item flex-horizontal">
            <div className="flex-spacer">Use the native broswer&#39;s or operating system ability to display desktop notifications.</div>
            <button
              className="button-secondary"
              onClick={this.onGrantNotificationClick}
            >Grant permissions</button>
          </div>)
        }
      </section>
    );
  }
}
