import React from "react";

import CreateOrJoin from "./CreateOrJoin.react";

export default class Welcome extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  }

  state = {
    choice: 0
  }

  render() {
    const { user } = this.props;
    return (
      <div className="welcome">
        <h2>Welcome to {Minni.name}, {user.fullname}</h2>
        <p>Almost done !<br /> Would you mind taking a minute to finish your setup ?</p>
        <CreateOrJoin />
      </div>
    );
  }
}
