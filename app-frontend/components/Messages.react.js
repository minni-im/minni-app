import React from "react";
import classnames from "classnames";

import Logger from "../libs/Logger";
const logger = Logger.create("Messages.react");

import { AVATAR_SIZES, MessageStreamTypes } from "../Constants";
import Avatar from "./generic/Avatar.react";

class Message extends React.Component {
  render() {
    const { message } = this.props;
    let header, timestamp;
    if (this.props.first) {
      header = <div className="message--header">
        <span className="user-name">{message.user.fullname}</span>
        <span className="timestamp">{message.dateCreated.calendar()}</span>
      </div>;
    } else {
      timestamp = <div className="message--timestamp">{message.dateCreated.format("hh:mm A")}</div>;
    }
    let content = <div className="message--content">
      {message.content}
    </div>;

    let classNames = {
      "message-first": this.props.first
    };

    return <div className={classnames("message", classNames)}>
      {header}
      {timestamp}
      {content}
    </div>;
  }
}

Message.propTypes = {
  first: React.PropTypes.bool,
  message: React.PropTypes.object.isRequired
};

Message.defaultProps = {
  first: false
};


class MessageGroup extends React.Component {
  render() {
    const user = this.props.messages[0].user;
    const messages = this.props.messages.map((message, i) => {
      return <Message key={message.id}
        first={i === 0}
        message={message} />;
    });
    const avatar = <Avatar user={user} />;
    let classNames = {
      "message-group-me": this.props.viewer.id === user.id
    };
    return <div className={classnames("message-group", classNames)}>
      {avatar}
      <div className="group-content">
        {messages}
      </div>
    </div>;
  }
}

MessageGroup.propTypes = {
  messages: React.PropTypes.array.isRequired
};

class MessageTimestamp extends React.Component {
  render() {
    return <div className="message-timestamp">
      {this.props.children}
    </div>;
  }
}

export default class Messages extends React.Component {
  componentDidMount() {
    this.restoreScroll();
  }

  componentDidUpdate(prevProps, nextProps) {
    this.scrollToBottom();
  }

  restoreScroll() {
    // TODO: if user previously scrolled up, restore here.

    this.scrollToBottom();
  }

  scrollTo(offset) {
    const { scroller } = this.refs;
    scroller.scrollTop = offset;
  }

  scrollToBottom() {
    const { scroller } = this.refs;
    this.scrollTo(scroller.scrollHeight);
  }

  render() {
    const messageGroup = this.regroupMessages(this.props.messages);
    const messageGroupFinal = messageGroup.map(({ type, content }, i) => {
      if (type === MessageStreamTypes.DIVIDER_TIME_STAMP) {
        return <MessageTimestamp key={i}><h4>{content}</h4></MessageTimestamp>;
      }

      return <MessageGroup key={content[0].id}
        viewer={this.props.viewer}
        messages={content} />;
    });

    return <section className="panel panel--contrast messages" ref="scroller" onScroll={this._handleScroll.bind(this)}>
      {messageGroupFinal}
    </section>;
  }

  regroupMessages(messages) {
    let messageGroups = [];
    messages.forEach(message => {
      const lastMessageGroup = messageGroups[messageGroups.length - 1];
      if (lastMessageGroup == null ||
          lastMessageGroup[0].user.id !== message.user.id ||
          lastMessageGroup[0].dateCreated.day() !== message.dateCreated.day() ||
          lastMessageGroup[0].dateCreated.hour() !== message.dateCreated.hour()) {
        messageGroups.push([message]);
      } else {
        lastMessageGroup.push(message);
      }
    });

    let lastTimestamp;
    let messageStream = [];
    messageGroups.forEach(group => {
      const timestamp = group[0].dateCreated.format("dddd, LL");
      if (timestamp !== lastTimestamp) {
        if (lastTimestamp != null) {
          messageStream.push({
            type: MessageStreamTypes.DIVIDER_TIME_STAMP,
            content: timestamp
          });
        }
        lastTimestamp = timestamp;
      }
      messageStream.push({
        type: MessageStreamTypes.MESSAGE_GROUP,
        content: group
      });
    });
    return messageStream;
  }

  _handleScroll() {
    logger.warn("scrolling...");
  }
}
