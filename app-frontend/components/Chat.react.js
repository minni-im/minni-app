import React, { PropTypes } from "react";

class Chat extends React.Component {
  render () {
    const { children } = this.props;
    return <main className="lobby">
      {children.content}
      {children && children.sidebar ? children.sidebar : false}
    </main>;
  }
}

export default Chat;
