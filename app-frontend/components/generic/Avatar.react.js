import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import User from "../../models/User";
import { AVATAR_SIZES, USER_STATUS } from "../../Constants";

import UserStatusIcon from "../UserStatusIcon.react";

export default function Avatar(props) {
  const { user, size, isTyping, withStatus, showOffline, withTooltip } = props;
  const styles = {};
  const classNames = {
    [`avatar-${size}`.toLowerCase()]: true,
    "avatar--with-initials": !user.picture,
    "avatar--offline": user.status === USER_STATUS.OFFLINE && showOffline,
    "with-tooltip": withTooltip,
  };
  if (user.picture) {
    styles.backgroundImage = `url(${user.picture})`;
  }

  const extractTooltip = () => {
    if (withTooltip.length) {
      return withTooltip;
    }
    return user.fullname;
  };

  return (
    <div
      className={classnames("avatar", classNames, props.className)}
      style={styles}
      data-initials={user.initials}
      data-tooltip={extractTooltip()}
    >
      {withStatus ? <UserStatusIcon status={user.status} typing={isTyping} /> : null}
    </div>
  );
}

Avatar.SIZE = AVATAR_SIZES;
Avatar.propTypes = {
  user: PropTypes.instanceOf(User).isRequired,
  size: PropTypes.oneOf([
    AVATAR_SIZES.SMALL,
    AVATAR_SIZES.MEDIUM,
    AVATAR_SIZES.LARGE,
    AVATAR_SIZES.XLARGE,
  ]),
  className: PropTypes.string,
  isTyping: PropTypes.bool,
  withStatus: PropTypes.bool,
  withTooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  showOffline: PropTypes.bool,
};

Avatar.defaultProps = {
  size: AVATAR_SIZES.MEDIUM,
  isTyping: false,
  withStatus: false,
  withTooltip: false,
  showOffline: false,
};
