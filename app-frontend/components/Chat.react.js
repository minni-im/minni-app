import React, { PropTypes } from "react";

import { dispatch } from "../dispatchers/Dispatcher";

import Account from "../models/Account";

class Chat extends React.Component {

  render () {
    const { children } = this.props;
    return <main className="lobby">
      {React.cloneElement(children.content, {
        currentUser: this.props.currentUser,
        currentAccount: this.props.currentAccount,
        accounts: this.props.accounts
      })}
      {children && children.sidebar ?
        React.cloneElement(children.sidebar, {
          currentAccount: this.props.currentAccount
        }) : false}
    </main>;
  }
}

export default Chat;
