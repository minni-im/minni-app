import React from "react";
import PropTypes from "prop-types";
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
  user: PropTypes.instanceOf(User),
  explanation: PropTypes.bool,
};

Welcome.defaultProps = {
  explanation: true,
};
