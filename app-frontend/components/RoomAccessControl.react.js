import React from "react";
import classNames from "classnames";

import Avatar from "./generic/Avatar.react";
import SettingItem from "./settings/SettingItem.react";

import UserStore from "../stores/UserStore";
import SelectedAccountStore from "../stores/SelectedAccountStore";

const PUBLIC = 1;
const PRIVATE = 2;

const TITLE = {
  [PUBLIC]: "This room is public",
  [PRIVATE]: "This room is private"
};

const DESC = {
  [PUBLIC]: "Anyone in the team can access it.",
  [PRIVATE]: "Only selected teammates can see &amp; access the room"
};


export default class RoomAccessControl extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    type: React.PropTypes.oneOf([PUBLIC, PRIVATE]),
    usersId: React.PropTypes.arrayOf(React.PropTypes.string),
    onTypeChange: React.PropTypes.func,
    onUsersChange: React.PropTypes.func
  }

  static defaultProps = {
    usersId: [],
    onTypeChange() {}
  }

  constructor(props) {
    super(props);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.onUserSelected = this.onUserSelected.bind(this);
    this.state = {
      type: this.props.type,
      usersId: this.props.usersId
    };
  }

  onSettingChange() {
    this.setState({
      type: this.state.type === PUBLIC ? PRIVATE : PUBLIC
    }, () => {
      this.props.onTypeChange(this.state.type);
    });
  }

  onUserSelected(event) {
    const userId = event.currentTarget.dataset.userId;
    const index = this.state.usersId.indexOf(userId);

    if (index !== -1) {
      this.state.usersId.splice(index, 1);
    } else {
      this.state.usersId.push(userId);
    }
    this.setState({
      usersId: this.state.usersId
    }, () => {
      this.props.onUsersChange(this.state.usersId);
    });
  }

  render() {
    const me = UserStore.getConnectedUser();
    const { type } = this.state;
    const toggleStatus = (
      <SettingItem
        title={TITLE[type]}
        desc={DESC[type]}
        setting="foo"
        default={type}
        choices={[
          { label: "Public", value: 1 },
          { label: "Private", value: 2 }
        ]}
        onChange={this.onSettingChange}
      />
    );

    const mates = SelectedAccountStore.getUsers([me && me.id]);
    const matesSelector = type === PRIVATE ? (
      <div className={classNames("room--access-control", this.props.className)}>
        {mates.map((user, index) => (
          <div
            key={index}
            data-user-id={user.id}
            className={classNames("coworker flex-horizontal", {
              active: this.state.usersId.includes(user.id)
            })}
            onClick={this.onUserSelected}
          >
            <Avatar user={user} />
            <div className="flex-spacer user-details">
              <div className="user--fullname">{user.fullname}</div>
              <div className="user--nickname">@{user.nickname}</div>
            </div>
          </div>
        )).toArray()}
      </div>
    ) : false;

    return (
      <div>
        {toggleStatus}
        {matesSelector}
      </div>
    );
  }
}
