import React from "react";
import Immutable from "immutable";

import * as RoomActionCreators from "../../actions/RoomActionCreators";

import RoomAccessControl from "../RoomAccessControl.react";

import ConfirmButton from "../generic/ConfirmButton.react";
import Dialog from "../generic/Dialog.react";
import TabBar, { TabPanel } from "../generic/TabBar.react";


import PluginsStore from "../../stores/PluginsStore";
import { PLUGIN_TYPES } from "../../Constants";

import { TrashIcon } from "../../utils/IconsUtils";
import { camelize } from "../../utils/TextUtils";

export default class RoomSettingsDialog extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.onDescChange = this.onDescChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onUsersChange = this.onUsersChange.bind(this);
  }

  state = {
    selectedTab: 0,
    visible: true
  }

  componentDidMount() {
    this.newSettings = Immutable.Map();
  }

  onCloseDialog(action) {
    if (action === "delete") {
      /* eslint-disable */
      let [app, accountSlug, ...roomSlugs] = document.location.pathname.slice(1).split("/");
      /* eslint-enable  */
      const active = roomSlugs.includes(this.props.room.slug);
      RoomActionCreators.deleteRoom(this.props.room.id)
        .then(() => {
          if (active) {
            this.context.router.push(`/chat/${accountSlug}/lobby`);
          } else {
            this.props.onClose(action);
          }
        });
      return;
    }

    if (action === "save") {
      if (!this.newSettings.isEmpty()) {
        const payload = this.newSettings.toJS();
        RoomActionCreators
          .updateRoom(this.props.room.id, payload)
          .then(({ ok, message }) => {
            if (ok) {
              this.props.onClose(action);
              return;
            }
          });
        return;
      }
    }
    this.props.onClose(action);
  }

  onTypeChange(type) {
    this.newSettings = this.newSettings.set("type", type);
    if (type === 1) {
      this.newSettings = this.newSettings.set("usersId", []);
    }
  }

  onUsersChange(usersId) {
    this.newSettings = this.newSettings.set("usersId", usersId);
  }

  onSettingChange() {

  }

  onDescChange(event) {
    const { id: key, value } = event.target;
    this.newSettings = this.newSettings.set(key, value);
  }

  generateOverview() {
    const {
      name,
      topic
    } = this.props.room;
    return [
      <section>
        <h3>Room details</h3>
        <h4>
          <label htmlFor="name">Room name</label>
        </h4>
        <div>
          <input
            type="text"
            readOnly
            defaultValue={name}
            id="name"
          />
        </div>
        <h4>
          <label htmlFor="topic">Room topic</label>
        </h4>
        <div>
          <input
            type="text"
            defaultValue={topic}
            id="topic"
            onBlur={this.onDescChange}
          />
        </div>
      </section>,
      this.generateMembersAccess()
    ];
  }

  generateInvites() {
    return [
      <section>
        <h3>Invite other team members</h3>
      </section>
    ];
  }

  generateMembersAccess() {
    return (
      <section>
        <h3>Members access</h3>
        <RoomAccessControl
          type={this.props.room.type}
          onTypeChange={this.onTypeChange}
          onUsersChange={this.onUsersChange}
          usersId={[...this.props.room.usersId]}
        />
      </section>
    );
  }

  renderRoomPrivate() {
    return (
      <div>This room is private</div>
    );
  }

  renderRoomPublic() {
    return (
      <div>This is room is public.
      Anyone from the team can see it and access it.</div>
    );
  }

  render() {
    const buttons = [
      <ConfirmButton action="delete">
        <button className="button-danger button-icon">
          <TrashIcon className="icon" />
        </button>
        <button
          className="button-danger"
          title="Clicking this button will delete this room. This can not be recovered."
        >
          Delete
        </button>
      </ConfirmButton>,
      { action: "save", label: "Save", isPrimary: true }
    ];

    const categories = {
      overview: [].concat(this.generateOverview()),
      "instant invitations": [].concat(this.generateInvites())
    };

    PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_COMMAND)
      .filter(plugin => !!plugin.SettingsPanel)
      .map(plugin => plugin.SettingsPanel)
      .forEach(panel => {
        const { category } = panel;
        categories[category] = (categories[category] || []).concat(panel);
      });


    const tabs = Object.keys(categories).map(category => {
      const contentSections = categories[category]
        .map((Section, index) => (
          React.isValidElement(Section) ?
            React.cloneElement(Section, { key: index }) :
            <Section key={index} onChange={this.onSettingChange} />
        ));
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
        subtitle={this.props.room.name}
        buttons={buttons}
        additionalClassNames="panel settings-dialog room-settings-dialog"
        onClose={this.onCloseDialog}
      >
        <TabBar selected={this.state.selectedTab}>
          {tabs}
        </TabBar>
      </Dialog>
    );
  }
}
