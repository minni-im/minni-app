import React from "react";
import PropTypes from "prop-types";
import Immutable from "immutable";
import { withRouter } from "react-router-dom";

import * as RoomActionCreators from "../../actions/RoomActionCreators";

import RoomAccessControl from "../RoomAccessControl.react";

import ConfirmButton from "../generic/ConfirmButton.react";
import Dialog from "../generic/Dialog.react";
import TabBar, { TabPanel } from "../generic/TabBar.react";

import PluginsStore from "../../stores/PluginsStore";
import { PLUGIN_TYPES } from "../../Constants";

import Room from "../../models/Room";

import { TrashIcon } from "../../utils/IconsUtils";
import { camelize, slugify } from "../../utils/TextUtils";

class RoomSettingsDialog extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    room: PropTypes.instanceOf(Room).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.onNameDescChange = this.onNameDescChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onUsersChange = this.onUsersChange.bind(this);
  }

  state = {
    selectedTab: 0,
    visible: true,
  };

  componentDidMount() {
    this.newSettings = Immutable.Map();
  }

  onCloseDialog(action) {
    const { accountSlug, roomSlugs } = this.props.match.params;
    if (action === "delete") {
      const active = (roomSlugs || []).includes(this.props.room.slug);
      RoomActionCreators.deleteRoom(this.props.room.id).then(() => {
        if (active) {
          this.props.history.push(`/chat/${accountSlug}/lobby`);
        } else {
          this.props.onClose(action);
        }
      });
      return;
    }

    if (action === "save") {
      if (!this.newSettings.isEmpty()) {
        const payload = this.newSettings.toJS();
        RoomActionCreators.updateRoom(this.props.room.id, payload).then(({ ok, room }) => {
          if (ok) {
            if (this.props.room.name !== room.name) {
              this.props.history.replace(`/chat/${accountSlug}/messages/${slugify(room.name)}`);
            }
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

  onSettingChange() {}

  onNameDescChange(event) {
    const { id: key, value } = event.target;
    this.newSettings = this.newSettings.set(key, value);
  }

  generateOverview() {
    const { name, topic, type } = this.props.room;
    const sections = [
      <section>
        <h3>Room details</h3>
        <h4>
          <label htmlFor="name">
            Room name
          </label>
        </h4>
        <div>
          {type === 0
            ? <input
              type="text"
              readOnly
              placeholder={`${name} (name of the default initial room can not be changed)`}
              id="name"
            />
            : <input type="text" defaultValue={name} id="name" onBlur={this.onNameDescChange} />}

        </div>
        <h4>
          <label htmlFor="topic">Room topic</label>
        </h4>
        <div>
          <input type="text" defaultValue={topic} id="topic" onBlur={this.onNameDescChange} />
        </div>
      </section>,
    ];
    if (this.props.room.type !== 0) {
      sections.push(this.generateMembersAccess());
    }
    return sections;
  }

  generateInvites() {
    return [
      <section>
        <h3>Invite other team members</h3>
      </section>,
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
    return <div>This room is private</div>;
  }

  renderRoomPublic() {
    return (
      <div>
        This is room is public.
        Anyone from the team can see it and access it.
      </div>
    );
  }

  render() {
    const buttons = [{ action: "save", label: "Save", isPrimary: true }];

    if (this.props.room.type !== 0) {
      buttons.unshift(
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
        </ConfirmButton>
      );
    }

    const categories = {
      overview: [].concat(this.generateOverview()),
      // "instant invitations": [].concat(this.generateInvites())
    };

    PluginsStore.getPlugins(PLUGIN_TYPES.COMPOSER_COMMAND)
      .filter(plugin => !!plugin.SettingsPanel)
      .map(plugin => plugin.SettingsPanel)
      .forEach((panel) => {
        const { category } = panel;
        categories[category] = (categories[category] || []).concat(panel);
      });

    const tabs = Object.keys(categories).map((category) => {
      const contentSections = categories[category].map(
        (Section, index) =>
          React.isValidElement(Section)
            ? React.cloneElement(Section, { key: index })
            : <Section key={index} onChange={this.onSettingChange} />
      );
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

export default withRouter(RoomSettingsDialog);
