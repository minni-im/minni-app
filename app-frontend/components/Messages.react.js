import React from "react";


class Message extends React.Component {
  render() {
    return <div className="message">{this.props.message.content}</div>;
  }
}

export default class Messages extends React.Component {
  render() {
    const messages = this.props.messages.map(message => {
      return <Message key={message.id} message={message} />;
    });

    return <div className="messages">
      {messages}
    </div>;
  }
}
