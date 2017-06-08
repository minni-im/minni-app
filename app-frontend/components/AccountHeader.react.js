import React from "react";
import PropTypes from "prop-types";

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
  hasLogo: PropTypes.bool,
  account: PropTypes.instanceOf(Account),
};
