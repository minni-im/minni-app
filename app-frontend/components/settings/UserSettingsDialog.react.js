import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";

import Dialog from "../generic/Dialog.react";
import TabBar, { TabPanel } from "../generic/TabBar.react";

import Avatar from "../generic/Avatar.react";
import SettingItem from "./SettingItem.react";

import User from "../../models/User";

import PluginsStore from "../../stores/PluginsStore";
import { PLUGIN_TYPES } from "../../Constants";

import { camelize } from "../../utils/TextUtils";

import Logger from "../../libs/Logger";

const logger = Logger.create("UserSettingsDialog");

export default class UserSettingsDialog extends React.Component {
  static propTypes = {
    user: PropTypes.instanceOf(User),
    onClose: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.onUserInfoChange = this.onUserInfoChange.bind(this);
  }

  state = {
    selectedTab: 0,
  };

  componentDidMount() {
    this.newSettings = Immutable.Map();
    this.userInfo = Immutable.Map();
  }

  onCloseDialog(action) {
    const payload = {
      userInfo: false,
      settings: false,
    };
    if (!this.newSettings.isEmpty()) {
      payload.settings = this.newSettings.toJS();
    }
    if (!this.userInfo.isEmpty()) {
      payload.userInfo = this.userInfo.toJS();
    }
    this.props.onClose(action, payload);
  }

  onSettingChange(key, newValue) {
    logger.info(`Setting '${key}' changed to: ${newValue}`);
    this.newSettings = this.newSettings.setIn(key.split("."), newValue);
  }

  onUserInfoChange({ target: input }) {
    const { id, value } = input;
    const trimmedValue = value.trim();
    if (trimmedValue.length) {
      this.userInfo = this.userInfo.set(id, trimmedValue);
    }
  }

  generateGeneral() {
    return [
      <section>
        <SettingItem
          setting="global.clock24"
          title="Use 24hr clock."
          onChange={this.onSettingChange}
        />
        <SettingItem
          setting="global.rooms.enter"
          title="Enter sends messages. Shift+Enter adds a new line."
          desc="When disabled, Enter adds a new line, and Shit+Enter sends messages."
          onChange={this.onSettingChange}
        />
      </section>,
      <section className="emojis">
        <h3>Emojis</h3>
        <SettingItem
          title="Allows emoticons replacement in typed text."
          setting="global.emoticons"
          onChange={this.onSettingChange}
        >
          We support standard emoticons & emojis. Hints available{" "}
          <a
            href="http://www.emoji-cheat-sheet.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </SettingItem>

        <SettingItem
          title="Type of emojis."
          desc="You can specify the set of emojis to be used."
          setting="global.emojis_type"
          choices={[
            { label: "Apple", value: "apple" },
            // { label: "Emojione", value: "emojione" },
            { label: "Twitter", value: "twitter" },
          ]}
          onChange={this.onSettingChange}
        />
      </section>,
      <section>
        <h3>Text & images</h3>
        <SettingItem
          setting="global.rooms.image_preview"
          title="Show inline preview of images."
          desc="Images links such as jpegs, gifs &amp; lolcats will be embedded inline."
          onChange={this.onSettingChange}
        />
        <SettingItem
          setting="global.rooms.links_preview"
          title="Show inline preview of websites."
          desc="Show information of websites urls pasted into the chat."
          onChange={this.onSettingChange}
        />
      </section>,
      <section>
        <h3>Appearence</h3>
        <SettingItem
          setting="global.rooms.emphasis"
          title="Emphasis your chat message."
          desc="Use a different background color for all your messages."
          onChange={this.onSettingChange}
        />
      </section>,
    ];
  }

  generateNotifications() {
    return [
      <section>
        <h3>Sound blips</h3>
        <SettingItem
          setting="global.notification.sound"
          title="Play a sound to notify new messages."
          onChange={this.onSettingChange}
        />

        <SettingItem
          setting="global.notification.mentions"
          title="Play a different sound when notified in @mentions."
          onChange={this.onSettingChange}
        />

        <SettingItem
          setting="global.notification.sound_volume"
          title="Audio volume for notification."
          choices={[
            { label: "Loud", value: 100 },
            { label: "Medium", value: 50 },
            { label: "Low", value: 25 },
          ]}
          onChange={this.onSettingChange}
        />
      </section>,
    ];
  }

  generateConnections() {
    const { demo = false } = window.Minni;
    return [
      <section>
        <h3>One click login services</h3>
        <p>
          One-click Login is not yet configurable in the chat application.
          {!demo && [
            "You can modify it on your profile page ",
            <a
              key="open-profile"
              href="/profile"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>,
          ]}
        </p>
      </section>,
    ];
  }

  renderProfile() {
    const {
      firstname,
      lastname,
      nickname,
      email,
      gravatarEmail,
    } = this.props.user;
    const { demo = false } = window.Minni;
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
                defaultValue={firstname}
                id="firstname"
                placeholder="Your firstname"
                onBlur={this.onUserInfoChange}
              />
            </div>
            <h4>
              <label htmlFor="lastname">Lastname</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={lastname}
                id="lastname"
                placeholder="Your lastname"
                onBlur={this.onUserInfoChange}
              />
            </div>
            <h4>
              <label htmlFor="nickname">Nickname</label>
            </h4>
            <div>
              <input
                type="text"
                defaultValue={nickname}
                id="nickname"
                placeholder="Your nickname"
                onBlur={this.onUserInfoChange}
              />
            </div>
            <h4>
              <label htmlFor="email">Email</label>
            </h4>
            <div>
              <input
                type="text"
                readOnly={demo}
                defaultValue={demo ? "N/A in demo" : email}
                id="email"
                placeholder="Your email"
                onBlur={this.onUserInfoChange}
              />
            </div>
            <h4>
              <label htmlFor="gravatarEmail">Gravatar email</label>
            </h4>
            <div>
              <input
                type="text"
                readOnly={demo}
                defaultValue={demo ? "N/A in demo" : gravatarEmail}
                id="gravatarEmail"
                placeholder={!gravatarEmail ? email : gravatarEmail}
                onBlur={this.onUserInfoChange}
              />
            </div>
          </section>
          <section className="user-profile--avatar flex-spacer">
            <h4>Avatar</h4>
            <Avatar user={this.props.user} size={Avatar.SIZE.XLARGE} />
            <p>
              Avatars are provided by{" "}
              <a
                href="https://gravatar.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                gravatar
              </a>{" "}
              services. You can change yours on their website.
            </p>
          </section>
        </div>
      </TabPanel>
    );
  }

  render() {
    const buttons = [{ action: "save", label: "Save" }];

    const categories = {
      general: [].concat(this.generateGeneral()),
      notifications: [].concat(this.generateNotifications()),
      connections: [].concat(this.generateConnections()),
    };

    PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_TEXT | PLUGIN_TYPES.MESSAGE)
      .filter((plugin) => !!plugin.SettingsPanel)
      .map((plugin) => plugin.SettingsPanel)
      .forEach((panel) => {
        const { category, prepend } = panel;
        if (prepend && prepend === true) {
          categories[category] = [panel].concat(categories[category] || []);
        } else {
          categories[category] = (categories[category] || []).concat(panel);
        }
      });

    const tabs = Object.keys(categories).map((category) => {
      const contentSections = categories[category].map((Section, index) => {
        if (React.isValidElement(Section)) {
          return React.cloneElement(Section, { key: index });
        }
        return <Section key={index} onChange={this.onSettingChange} />;
      });
      return (
        <TabPanel key={category} label={camelize(category)}>
          {contentSections}
        </TabPanel>
      );
    });

    return (
      <Dialog
        {...this.props}
        title="Settings"
        subtitle="Your settings"
        buttons={buttons}
        additionalClassNames="panel settings-dialog user-settings-dialog"
        onClose={this.onCloseDialog}
      >
        <TabBar selected={this.state.selectedTab}>
          {this.renderProfile()}
          {tabs}
        </TabBar>
      </Dialog>
    );
  }
}
