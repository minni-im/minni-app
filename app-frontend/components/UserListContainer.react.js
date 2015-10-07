import React from "react";
import { Container } from "flux/utils";

import UserList from "./UserList.react";

import UserStore from "../stores/UserStore";

class UserListContainer extends React.Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState(prevState, prevProps) {
    const viewer = UserStore.getConnectedUser();
    return {
      viewer: viewer,
      users: UserStore.getUsers(prevProps.usersId, [ viewer.id ])
    };
  }

  render() {
    return <UserList viewer={this.state.viewer} users={this.state.users} />;
  }
}

const container = Container.create(UserListContainer, { withProps: true });
export default container;
