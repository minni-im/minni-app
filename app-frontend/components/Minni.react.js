import React from "react";

import AccountSwitcher from "./sidebars/AccountSwitcher.react";
import SoundPlayer from "./generic/SoundPlayer.react";

export default class MinniPanel extends React.Component {
  render() {
    const { content, sidebar } = this.props;
    return <div className="minni-app">
      <AccountSwitcher />
      {sidebar ? sidebar : false}
      {content ? content : false}
      <SoundPlayer />
    </div>;
  }
}
