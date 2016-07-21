import React from "react";

import { USER_STATUS, USER_STATUS_TEXT } from "../Constants";

export default function UserStatus(props) {
  return (
    <div className="user-status">{USER_STATUS_TEXT[props.status]}</div>
  );
}

UserStatus.propTypes = {
  status: React.PropTypes.oneOf([0, 1, 2, 4, 8, 16])
};
