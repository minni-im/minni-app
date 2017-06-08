import React from "react";
import PropTypes from "prop-types";

import { USER_STATUS, USER_STATUS_TEXT } from "../Constants";

export default function UserStatus(props) {
  return <div className="user-status">{USER_STATUS_TEXT[props.status]}</div>;
}

UserStatus.propTypes = {
  status: PropTypes.oneOf([
    USER_STATUS.OFFLINE,
    USER_STATUS.CONNECTING,
    USER_STATUS.ONLINE,
    USER_STATUS.IDLE,
    USER_STATUS.AWAY,
    USER_STATUS.DND,
  ]),
};
