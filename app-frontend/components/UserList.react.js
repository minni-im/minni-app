import React from "react";
import { Map } from "immutable";

export default class UserList extends React.Component {
  render() {
    return <div className="user-list">
      {this.props.users.toIndexedSeq().map(user => {
        return <div key={user.id}>{user.fullname}</div>;
      })}
    </div>;
  }
}

UserList.defaultProps = {
  users: Map()
};
