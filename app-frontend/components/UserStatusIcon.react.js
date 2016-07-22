import React from "react";

import { USER_STATUS } from "../Constants";

export default function UserStatusIcon(props) {
  const statusCode = Math.max(0, Math.log(props.status) / Math.log(2));
  return (
    <div
      className="user-status-icon"
      data-status={statusCode}
    ></div>
  );
}

UserStatusIcon.propTypes = {
  status: React.PropTypes.oneOf([
    USER_STATUS.OFFLINE,
    USER_STATUS.CONNECTING,
    USER_STATUS.ONLINE,
    USER_STATUS.IDLE,
    USER_STATUS.AWAY,
    USER_STATUS.DND
  ])
};
