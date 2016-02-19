import React from "react";
import Immutable from "immutable";

import Dialog from "../generic/Dialog.react";
import TabBar, { TabPanel } from "../generic/TabBar.react";

import Avatar from "../generic/Avatar.react";
import SettingItem from "./SettingItem.react";

import { updateSettings } from "../../actions/SettingsActionCreators";

import Logger from "../../libs/Logger";
const logger = Logger.create("UserSettingsDialog");


const NOTIFICATION_GRANTED = "granted";

function checkPermission() {
  if (window.Notification && window.Notification.permission) {
    return window.Notification.permission;
  }
}

function grantPermission(callback) {
  window.Notification.requestPermission(function(permission) {
    return callback(permission === NOTIFICATION_GRANTED, permission);
  });
}

export default class UserSettingsDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: 0,
      notifGranted: checkPermission() === NOTIFICATION_GRANTED
    };

    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onGrantNotificationClick = this.onGrantNotificationClick.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.onUserInfoChange = this.onUserInfoChange.bind(this);
  }
  
  componentDidMount() {
    this.newSettings = Immutable.Map();
    this.userInfo = Immutable.Map();
  }

  render() {
    let buttons = [
      { action: "save", label: "Save" }
    ];

    return (
      <Dialog
        {...this.props}
        title="Settings"
        subtitle="Your settings"
        buttons={ buttons }
        additionalClassNames="user-settings-dialog panel"
        onClose={ this.onCloseDialog }
      >
        <TabBar selected={ this.state.selectedTab }>
          {this.renderProfile()}
          {this.renderGeneral()}
          {this.renderNotifications()}
          {this.renderPlugins()}
          {this.renderConnections()}
        </TabBar>
      </Dialog>
    )
  }

  onCloseDialog( action ) {
    const payload = {
      userInfo: false,
      settings: false
    };
    if( !this.newSettings.isEmpty() ) {
      payload.settings = this.newSettings.toJS()
    }
    if ( !this.userInfo.isEmpty() ) {
      payload.userInfo = this.userInfo.toJS()
    }

    this.props.onClose( action, payload );
  }

  renderProfile() {
    const {
      firstname,
      lastname,
      nickname,
      email,
      gravatarEmail,
      picture } = this.props.user;

    return (
      <TabPanel label="Profile">
        <h3>Personnal details</h3>
        <div className="user-profile flex-horizontal">
          <section className="user-profile--info flex-spacer">
            <h4>
              <label htmlFor="firstname">Firstname</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={ firstname }
                id="firstname"
                placeholder="Your firstname"
                onBlur={ this.onUserInfoChange }
              />
            </div>
            <h4>
              <label htmlFor="lastname">Lastname</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={ lastname }
                id="lastname"
                placeholder="Your lastname"
                onBlur={ this.onUserInfoChange }
              />
            </div>
            <h4>
              <label htmlFor="nickname">Nickname</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={ nickname }
                id="nickname"
                placeholder="Your nickname"
                onBlur={ this.onUserInfoChange }
              />
            </div>
            <h4>
              <label htmlFor="email">Email</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={ email }
                id="email"
                placeholder="Your email"
                onBlur={ this.onUserInfoChange }
              />
            </div>
            <h4>
              <label htmlFor="gravatarEmail">Gravatar email</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={ gravatarEmail }
                id="gravatarEmail"
                placeholder={ !gravatarEmail ? email : gravatarEmail }
                onBlur={ this.onUserInfoChange }
              />
            </div>
          </section>
          <section className="user-profile--avatar flex-spacer">
            <h4>Avatar</h4>
            <Avatar user={ this.props.user } size={ Avatar.SIZE.XLARGE } />
            <p>Avatars are provided by <a href="https://gravatar.com" target="_blank">gravatar</a> services. You can change yours on their website.</p>
          </section>
        </div>
      </TabPanel>
    );
  }

  renderGeneral() {
    return (
      <TabPanel label="General">
        <SettingItem
          setting="global.clock24"
          title="Use 24hr clock."
          onChange={ this.onSettingChange }
          />

        <SettingItem
          setting="global.rooms.enter"
          title="Enter sends messages. Shift+Enter adds a new line."
          desc="When disabled, Enter adds a new line, and Shit+Enter sends messages."
          onChange={ this.onSettingChange }
          />

        <h3>Emojis</h3>
        <SettingItem
          title="Allows emoticons replacement in typed text."
          setting="global.emoticons"
          onChange={ this.onSettingChange }
          >We support standard emoticons &amp; emojis. Hints available <a href="http://www.emoji-cheat-sheet.com/" target="_blank">here</a>.</SettingItem>

        <SettingItem
          title="Type of emojis."
          desc="You can specify the set of emojis to be used."
          setting="global.emojis_type"
          choices={ [
            { label: "Apple", value: "apple" },
            { label: "Twitter", value: "twitter" },
            { label: "Hangouts", value: "hangouts" }
          ] }
          onChange={ this.onSettingChange }
          />

        <h3>Text &amp; images</h3>
        <SettingItem
          setting="global.rooms.image_preview"
          title="Show inline preview of images."
          desc="Images links such as jpegs, gifs &amp; lolcats will be embedded inline."
          onChange={ this.onSettingChange }
          />
        <SettingItem
          setting="global.rooms.links_preview"
          title="Show inline preview of websites."
          desc="Show information of websites urls pasted into the chat."
          onChange={ this.onSettingChange }
          />

        <h3>Appearence</h3>

        <SettingItem
          setting="global.rooms.emphasis"
          title="Emphasis your chat message."
          desc="Use a different background color for all your messages."
          onChange={ this.onSettingChange }
          />

      </TabPanel>
    );
  }

  renderNotifications() {
    return (
      <TabPanel label="Notifications">
        <h3>Desktop notification</h3>
        { this.state.notifGranted ?
          <SettingItem
            setting="global.notification.desktop"
            title="Use the native broswer&#39;s or operating system ability to display desktop notifications."
            onChange={ this.onSettingChange }
          /> :
          <div className="setting-item flex-horizontal">
            <div className="flex-spacer">Use the native broswer&#39;s or operating system ability to display desktop notifications.</div>
            <button
              className="button-secondary"
              onClick={ this.onGrantNotificationClick }
            >Grant permissions</button>
          </div> }

        <h3>Sound blips</h3>
        <SettingItem
          setting="global.notification.sound"
          title="Play a sound to notify new messages."
          onChange={ this.onSettingChange }
          />

        <SettingItem
          setting="global.notification.mentions"
          title="Play a different sound when notified in @mentions."
          onChange={ this.onSettingChange }
          />

        <SettingItem
          setting="global.notification.sound_volume"
          title="Audio volume for notification."
          choices={ [
            { label: "Loud", value: 100 },
            { label: "Medium", value: 50 },
            { label: "Low", value: 25 },
          ] }
          onChange={ this.onSettingChange }
          />
      </TabPanel>
    );
  }

  renderPlugins() {
    const { settings } = this.state;
    return (
      <TabPanel label="Plugins">
        <h3>Alias</h3>
      </TabPanel>
    );
  }

  renderConnections() {
    return (
      <TabPanel label="Connections">
        <h3>One click login services</h3>
        <p>One-click Login is not yet configurable in the chat application. You can modify it on your profile page <a href="/profile" target="_blank">here</a></p>
      </TabPanel>
    );
  }

  onSettingChange( key, newValue ) {
    logger.info(`Setting '${key}' changed to: ${newValue}`);
    this.newSettings = this.newSettings.setIn(key.split("."), newValue);
  }

  onUserInfoChange( { target: input } ) {
    const { id, value } = input;
    this.userInfo = this.userInfo.set(id, value);
  }

  onGrantNotificationClick() {
    grantPermission( ( granted, permission ) => {
      this.setState( {
        notifGranted: granted
      } );

      updateSettings( {
        global: {
          notification: {
            desktop: true
          }
        }
      } );
    } );
  }
}
