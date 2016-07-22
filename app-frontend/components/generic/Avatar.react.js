import React from "react";
import classnames from "classnames";

import User from "../../models/User";
import { AVATAR_SIZES } from "../../Constants";

import UserStatusIcon from "../UserStatusIcon.react";

export default function Avatar(props) {
  const { user, size } = props;
  const styles = {};
  const classNames = {
    [`avatar-${size}`.toLowerCase()]: true,
    "avatar--with-initials": !user.picture
  };
  if (user.picture) {
    styles.backgroundImage = `url(${user.picture})`;
  }

  return (
    <div
      className={classnames("avatar", classNames, props.className)}
      style={styles}
      data-initials={user.initials}
    >
      {props.withStatus ? <UserStatusIcon status={user.status} /> : null}
    </div>
  );
}

Avatar.SIZE = AVATAR_SIZES;
Avatar.propTypes = {
  user: React.PropTypes.instanceOf(User).isRequired,
  size: React.PropTypes.oneOf([
    AVATAR_SIZES.SMALL,
    AVATAR_SIZES.MEDIUM,
    AVATAR_SIZES.LARGE,
    AVATAR_SIZES.XLARGE
  ]),
  className: React.PropTypes.string,
  isTyping: React.PropTypes.bool,
  withStatus: React.PropTypes.bool
};

Avatar.defaultProps = {
  size: AVATAR_SIZES.MEDIUM,
  isTyping: false,
  withStatus: false
};
