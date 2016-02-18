import React from "react";
import Dialog from "../generic/Dialog.react";
import TabBar, { TabPanel } from "../generic/TabBar.react";

import SettingItem from "./SettingItem.react";

import UserStore from "../../stores/UserStore";

export default class UserSettingsDialog extends React.Component {
  constructor(props) {
    super(props);
    const user = UserStore.getConnectedUser();
    this.state = {
      selectedTab: 1,
      user,
      settings: user.settings
    };

    this.onCloseDialog = this.onCloseDialog.bind(this);
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
          {this.renderInformation()}
          {this.renderGeneral()}
          {this.renderNotifications()}
          {this.renderPlugins()}
        </TabBar>
      </Dialog>
    )
  }

  onCloseDialog( action ) {
    this.props.onClose( action );
  }

  renderInformation() {
    const {
      firstname,
      lastname,
      nickname,
      email,
      gravatar_email } = this.state.user;

    return (
      <TabPanel label="Information">
        <h3>Personnal details</h3>
        <section className="info">
          <h4>
            <label htmlFor="firstname">Firstname</label>
          </h4>
          <div>
            <input
              type="text"
              defaultValue={ firstname }
              id="firstname"
              placeholder="Your firstname"
            />
          </div>
          <h4>
            <label htmlFor="firstname">Lastname</label>
          </h4>
          <div>
            <input
              type="text"
              defaultValue={ lastname }
              id="lastname"
              placeholder="Your lastname"
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
            />
          </div>
          <h4>
            <label htmlFor="gravatar">Gravatar email</label>
          </h4>
          <div>
            <input
              type="text"
              defaultValue={ gravatar_email }
              id="gravatar"
              placeholder={ gravatar_email === "" ? email : gravatar_email }
            />
          </div>
        </section>

        <h3>Login services</h3>
        <p>One-click Login is not yet configurable in the chat application. You can modify it on your profile page <a href="/profile" target="_blank">here</a></p>
      </TabPanel>
    );
  }

  renderGeneral() {
    const { settings } = this.state.user;
    return (
      <TabPanel label="General">
        <SettingItem
          setting="global.clock24"
          title="Use 24hr clock."
          settings={ settings }
          />
        <h3>Emoji &amp; emoticons</h3>
        <SettingItem
          title="Allows emoticons replacement."
          settings={ settings }
          setting="global.emoticons"
          >We support standard emoticons &amp; emojis. Hints available <a href="http://www.emoji-cheat-sheet.com/" target="_blank">here</a>.</SettingItem>

        <SettingItem
          title="Type of emoticons."
          desc="You can specify the set of emojis to be used."
          settings={ settings }
          setting="global.emojis_type"
          choices={ [
            { label: "Apple", value: "apple" },
            { label: "Twitter", value: "twitter" },
            { label: "Hangouts", value: "hangouts" }
          ] }
          />

        <h3>Rooms settings</h3>
        <SettingItem
          settings={ settings }
          setting="global.rooms.preview"
          title="Show inline preview of files."
          desc="Images such as gifs, sounds &amp; videos such as Youtube, Vimeo, etc.. will be embedded inline."
          />

        <SettingItem
          settings={ settings }
          setting="global.rooms.emphasis"
          title="Emphasis your chat message by using a different highlight color."
          />

        <SettingItem
          settings={ settings }
          setting="global.rooms.enter"
          title="Enter sends messages. Shift+Enter adds a new line."
          desc="When disabled, Enter adds a new line, and Shit+Enter sends messages."
          />
      </TabPanel>
    );
  }

  renderNotifications() {
    const { settings } = this.state.user;
    return (
      <TabPanel label="Notifications">
        <h3>Desktop notification</h3>
        <SettingItem
          settings={ settings }
          setting="global.notification.desktop"
          title="Show inline preview of files."
          desc="Images such as gifs, sounds &amp; videos such as Youtube, Vimeo, etc.. will be embedded inline."
          />

        <h3>Sound blips</h3>
        <SettingItem
          settings={ settings }
          setting="global.notification.sound"
          title="Play a sound to notify new messages."
          />

        <SettingItem
          settings={ settings }
          setting="global.notification.mentions"
          title="Play a different sound when notified in @mentions."
          />

        <SettingItem
          settings={ settings }
          setting="global.notification.sound_volume"
          title="Audio volume for notification."
          choices={ [
            { label: "Loud", value: 100 },
            { label: "Medium", value: 50 },
            { label: "Low", value: 25 },
          ] }
          />
      </TabPanel>
    );
  }

  renderPlugins() {
    const { settings } = this.state.user;
    return (
      <TabPanel label="Plugins">
        <h3>Alias</h3>
      </TabPanel>
    );
  }
}
