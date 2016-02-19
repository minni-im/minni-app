import React from "react";
import classnames from "classnames";

import User from "../../models/User";
import { AVATAR_SIZES, USER_STATUS } from "../../Constants";

export default class Avatar extends React.Component {
  render() {
    const { user, size } = this.props;

    let styles = {}, classNames = {
      [`avatar-${size}`.toLowerCase()]: true
    };
    if (user.picture) {
      styles.backgroundImage = `url(${user.picture})`;
    } else {
      classNames["avatar--with-initials"] = true;
    }
    return <div className={classnames("avatar", classNames)} style={styles} data-initials={user.initials}>

    </div>;
  }
}
Avatar.SIZE = AVATAR_SIZES;
Avatar.propTypes = {
  user: React.PropTypes.instanceOf(User).isRequired,
  typing: React.PropTypes.bool,
  size: React.PropTypes.oneOf([
    AVATAR_SIZES.SMALL,
    AVATAR_SIZES.MEDIUM,
    AVATAR_SIZES.LARGE,
    AVATAR_SIZES.XLARGE
  ]),
  status: React.PropTypes.oneOf([
    USER_STATUS.OFFLINE,
    USER_STATUS.ONLINE,
    USER_STATUS.IDLE,
    USER_STATUS.AWAY,
    USER_STATUS.DND
  ])
};

Avatar.defaultProps = {
  size: AVATAR_SIZES.MEDIUM,
  typing: false,
  status: USER_STATUS.OFFLINE
};
