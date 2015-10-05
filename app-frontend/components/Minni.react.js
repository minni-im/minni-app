import React from "react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";

class MinniPanel extends React.Component {

  render() {
    const { children } = this.props;

    return <div className="minni-app">
      <AccountSwitcher params={this.props.params} />
      {children ? children.sidebar : false}
      {children.content}
    </div>;
  }
}

export default MinniPanel;
