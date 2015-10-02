import React from "react";
import { Container } from "flux/utils";

import UserStore from "../stores/UserStore";

class UserInfoPanel extends React.Component {
  static getStores() {
    return [ UserStore ];
  }

  static calculateState(/*prevState*/) {
    return {
      user: UserStore.getConnectedUser()
    };
  }

  render() {
    const { user } = this.state;
    return <div className="user-info">
      <div className="user">
        <div className="user-avatar">
          <img src={user.picture} />
          <div className="user-status-icon" data-status="2"></div>
        </div>
        <div>
          <div className="user-name">{user.fullname}</div>
          <div className="user-status">online</div>
        </div>
      </div>
    </div>;
  }
}

const UserInfoPanelContainer = Container.create(UserInfoPanel);
export default UserInfoPanelContainer;
