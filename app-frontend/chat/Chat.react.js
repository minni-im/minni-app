import React from "react";

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
