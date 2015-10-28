import React from "react";


class Message extends React.Component {
  render() {
    const { message } = this.props;
    return <div className="message">{message.id} - {message.content}</div>;
  }
}

export default class Messages extends React.Component {
  render() {
    const messages = this.props.messages.toArray().map(message => {
      return <Message key={message.id} message={message} />;
    });

    return <div className="messages">
      {messages}
    </div>;
  }
}
