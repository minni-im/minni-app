import React from "react";
import classNames from "classnames";

import { USER_STATUS } from "../Constants";

export default function UserStatusIcon(props) {
  const statusCode = Math.max(0, Math.log(props.status) / Math.log(2));

  return (
    <div
      className={classNames("user-status-icon", {
        "user--is-typing": props.typing
      })}
      data-status={statusCode}
    />
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
  ]),
  typing: React.PropTypes.bool
};
