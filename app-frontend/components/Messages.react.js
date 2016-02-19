import React from "react";
import classnames from "classnames";

import Logger from "../libs/Logger";
const logger = Logger.create("Messages.react");

import { AVATAR_SIZES, MessageStreamTypes } from "../Constants";

import Avatar from "./generic/Avatar.react";
import Embed from "./Embed.react";


class Message extends React.Component {
  render() {
    const { message, renderEmbeds, inlineImages } = this.props;
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

    let embeds;
    if ( message.hasEmbeds() ) {
      if ( inlineImages && message.singleEmbed ) {
        content = <Embed {...message.embeds.get(0).toJS()} />;
      } else {
        if ( renderEmbeds ) {
          embeds = message.embeds.map((embed, index) => {
            return <Embed key={index} {...embed.toJS()} />;
          }).toArray();

          embeds = <div className="message--embeds">{embeds}</div>;
        }
      }
    }

    let classNames = {
      "message-first": this.props.first,
      "message-embed": message.hasEmbeds()
    };

    return <div className={classnames("message", classNames)}>
      {header}
      {timestamp}
      {content}
      {embeds}
    </div>;
  }
}

Message.propTypes = {
  first: React.PropTypes.bool,
  message: React.PropTypes.object.isRequired,
  renderEmbeds: React.PropTypes.bool,
  inlineImages: React.PropTypes.bool
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
        message={message}
        renderEmbeds={ this.props.renderEmbeds }
        inlineImages={ this.props.inlineImages } />;
    });
    const avatar = <Avatar user={user} />;
    let classNames = {
      "message-group-me": this.props.viewer.id === user.id
    };
    return <div className={classnames("message-group", "flex-horizontal", classNames)}>
      {avatar}
      <div className="group-content flex-spacer">
        {messages}
      </div>
    </div>;
  }
}

MessageGroup.propTypes = {
  messages: React.PropTypes.array.isRequired,
  renderEmbeds: React.PropTypes.bool,
  inlineImages: React.PropTypes.bool
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

  componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
    // // This would affect the overall scroll size. We don't bother, let's move back to bottom
    // if ( prevProps.renderEmbeds !== this.props.renderEmbeds ||
    //   prevProps.inlineImages !== this.props.inlineImages ) {
    //     this.scrollToBottom();
    // } // Last message has changed.
    // else if (this.props.messages.last() !== prevProps.messages.last()) {
    //   const latestMessage = this.props.messages.last();
    //   const currentUser = this.props.viewer;
    //   if (latestMessage && latestMessage.user.id === currentUser.id || this.isAtBottom()) {
    //     this.scrollToBottom();
    //   }
    // }

  }

  restoreScroll() {
    // TODO: if user previously scrolled up, restore here.

    this.scrollToBottom();
  }

  isAtBottom() {
    const { scroller } = this.refs;
    return scroller.scrollTop + scroller.clientHeight === scroller.scrollHeight;
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
        renderEmbeds={ this.props.renderEmbeds }
        inlineImages={ this.props.inlineImages }
        messages={content} />;
    });

    return <section className="panel panel--contrast flex-vertical flex-spacer" ref="scroller" onScroll={this._handleScroll.bind(this)}>
      <div className="panel-wrapper messages">{messageGroupFinal}</div>
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
    //logger.warn("scrolling...");
  }
}
