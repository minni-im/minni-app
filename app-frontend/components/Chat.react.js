import React, { PropTypes } from "react";

import { dispatch } from "../dispatchers/Dispatcher";

class Chat extends React.Component {

  componentWillMount() {
    fetch(`/api/accounts/${this.props.currentAccount.id}/users`, {
      credentials: "include"
    }).then((response) => {
      return response.json();
    }).then((payload) => {
      if (payload.ok) {
        const users = payload.users;
        dispatch({
          type: "users/add",
          payload: users
        });
      }
    });
  }

  render () {
    const { children } = this.props;
    return <main className="lobby">
      {React.cloneElement(children.content, { accounts: this.props.accounts })}
      {children && children.sidebar ?
        React.cloneElement(children.sidebar, {
          currentAccount: this.props.currentAccount
        }) : false}
    </main>;
  }
}

export default Chat;
