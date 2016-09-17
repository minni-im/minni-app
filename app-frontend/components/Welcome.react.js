import React from "react";
import CreateOrJoin from "./CreateOrJoin.react";

import User from "../models/User";

export default function Welcome(props) {
  const { user } = props;
  return (
    <div className="welcome">
      <h2>Welcome to {Minni.name}, {user.firstname}</h2>
      <p>Almost done !<br /> Would you mind taking a minute to finish your setup ?</p>
      <CreateOrJoin />
    </div>
  );
}

Welcome.propTypes = {
  user: React.PropTypes.instanceOf(User)
};
