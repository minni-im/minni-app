import React from "react";

import AccountSwitcher from "./AccountSwitcher.react";
import SoundPlayer from "../components/generic/SoundPlayer.react";

export default class Layout extends React.Component {
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
