import React, { PropTypes } from "react";

import { dispatch } from "../dispatchers/Dispatcher";

import Account from "../models/Account";

class Chat extends React.Component {

  render () {
    const { children } = this.props;
    return <main className="lobby">
      {children.content}
      {children && children.sidebar ?
        children.sidebar : false}
    </main>;
  }
}

export default Chat;
