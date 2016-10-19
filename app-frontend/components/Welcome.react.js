import React from "react";
import CreateOrJoin from "./CreateOrJoin.react";

import User from "../models/User";

export default function Welcome(props) {
  const { explanation, user } = props;

  let helpText = <p>Almost done !<br /> Would you mind taking a minute to finish your setup ?</p>;
  if (!explanation) {
    helpText = <p>Time to make a choice !</p>;
  }
  return (
    <div className="welcome">
      <h2>
        Welcome to {Minni.name}
        {user ? `, ${user.firstname}` : ""}
      </h2>
      {helpText}
      <CreateOrJoin />
    </div>
  );
}

Welcome.propTypes = {
  user: React.PropTypes.instanceOf(User),
  explanation: React.PropTypes.bool
};

Welcome.defaultProps = {
  explanation: true
};
