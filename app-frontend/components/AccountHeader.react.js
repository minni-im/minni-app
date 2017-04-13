import React from "react";

import Account from "../models/Account";

export default function AccountHeader({ account, hasLogo }) {
  if (hasLogo) {
    return <h1>{window.Minni.name}</h1>;
  }
  return (
    <div className="account">
      <h2>
        {account ? account.toString() : "..."}
      </h2>
      <em>{account ? account.description : "..."}</em>
    </div>
  );
}

AccountHeader.propTypes = {
  hasLogo: React.PropTypes.bool,
  account: React.PropTypes.instanceOf(Account),
};
