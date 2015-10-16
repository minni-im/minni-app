import React from "react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";

export default class MinniPanel extends React.Component {
  render() {
    const { children } = this.props;
    return <div className="minni-app">
      <AccountSwitcher />
      {children ? children.sidebar : false}
      {children.content}
    </div>;
  }
}
