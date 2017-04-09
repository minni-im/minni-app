import React from "react";
import { Map } from "immutable";

import Avatar from "./generic/Avatar.react";
import UserStatus from "./UserStatus.react";

export default function UserList(props) {
  return (
    <div className="user-list">
      {props.users.toIndexedSeq().map(user => (
        <div className="user-info flex-horizontal" key={user.id}>
          <Avatar className="user-avatar" user={user} withStatus showOffline />
          <div className="flex-spacer">
            <div className="user-name" title={user.fullname}>{user.fullname}</div>
            <UserStatus status={user.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

UserList.defaultProps = {
  users: Map(),
};
