import React from "react";
import { Map } from "immutable";

import { AVATAR_SIZES } from "../Constants";
import Avatar from "./generic/Avatar.react";

export default class UserList extends React.Component {
  render() {
    return <div className="user-list">
      {this.props.users.toIndexedSeq().map(user => {
        return <div key={user.id}>
          <Avatar user={user} size={AVATAR_SIZES.MEDIUM} />
          {user.fullname}
        </div>;
      })}
    </div>;
  }
}

UserList.defaultProps = {
  users: Map()
};
