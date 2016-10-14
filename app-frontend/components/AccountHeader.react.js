import React from "react";

import Account from "../models/Account";

export default function AccountHeader({ className, account, hasLogo }) {
  if (hasLogo) {
    return <h1>{window.Minni.name}</h1>;
  }
  return (
    <h2 className={className}>
      { account ?
        account.toString() :
        "..."
      }
    </h2>
  );
}

AccountHeader.propTypes = {
  className: React.PropTypes.string,
  hasLogo: React.PropTypes.bool,
  account: React.PropTypes.instanceOf(Account)
};
