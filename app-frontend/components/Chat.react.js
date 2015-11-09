import React, { PropTypes } from "react";

import { dispatch } from "../dispatchers/Dispatcher";

import Account from "../models/Account";

class Chat extends React.Component {

  render () {
    const { content, sidebar } = this.props;
    return <main className="lobby">
      {content}
      {sidebar ? sidebar : false}
    </main>;
  }
}

export default Chat;
