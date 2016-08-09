import React from "react";
import classnames from "classnames";

// TODO: This import is ugly. Should be changed to named export and imported with * as
import { default as RoomActionCreators } from "../actions/RoomActionCreators";
import { clearDimensions, updateDimensions } from "../actions/DimensionActionCreators";

import Logger from "../libs/Logger";
const logger = Logger.create("Messages.react");

import { MessageStreamTypes } from "../Constants";

import Avatar from "./generic/Avatar.react";
import Embed from "./Embed.react";
import WelcomeMessage from "./WelcomeMessage.react";


class Message extends React.Component {
  static propTypes = {
    first: React.PropTypes.bool,
    message: React.PropTypes.object.isRequired,
    renderEmbeds: React.PropTypes.bool,
    inlineImages: React.PropTypes.bool
  }

  static defaultProps = {
    first: false
  }

  render() {
    const { message, renderEmbeds, inlineImages } = this.props;
    let header;
    let timestamp;
    if (this.props.first) {
      header = (
        <div className="message--header">
          <span className="user-name">{message.user.fullname}</span>
          <span className="timestamp">{message.dateCreated.calendar()}</span>
        </div>
      );
    } else {
      timestamp = <div className="message--timestamp">{message.dateCreated.format("hh:mm A")}</div>;
    }

    let content = (
      <div className="message--content">
        {message.contentParsed}
      </div>
    );

    let embeds;
    if (message.hasEmbeds()) {
      if (inlineImages && message.singleEmbed) {
        content = <Embed {...message.embeds.get(0).toJS()} />;
      } else {
        if (renderEmbeds) {
          embeds = message.embeds.map((embed, index) =>
            <Embed key={index} {...embed.toJS()} />
          ).toArray();
          embeds = <div className="message--embeds">{embeds}</div>;
        }
      }
    }

    const classNames = {
      "message-first": this.props.first,
      "message-embed": message.hasEmbeds()
    };

    return (
      <div className={classnames("message", classNames)}>
        {header}
        {timestamp}
        {content}
        {embeds}
      </div>
    );
  }
}


class MessageGroup extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array.isRequired,
    renderEmbeds: React.PropTypes.bool,
    inlineImages: React.PropTypes.bool
  }

  render() {
    const user = this.props.messages[0].user;
    const messages = this.props.messages.map((message, i) => (
      <Message
        key={message.id}
        first={i === 0}
        message={message}
        renderEmbeds={this.props.renderEmbeds}
        inlineImages={this.props.inlineImages}
      />
    ));
    const avatar = <Avatar user={user} />;
    const classNames = {
      "message-group-me": this.props.viewer.id === user.id
    };
    return (
      <div className={classnames("message-group", "flex-horizontal", classNames)}>
        {avatar}
        <div className="group-content flex-spacer">
          {messages}
        </div>
      </div>
    );
  }
}

function MessageTimestamp(props) {
  return (
    <div className="message-timestamp">
      {props.children}
    </div>
  );
}

export default class Messages extends React.Component {
  static propTypes = {
    room: React.PropTypes.object.isRequired,
    messages: React.PropTypes.object.isRequired,
    dimensions: React.PropTypes.object,
    messagesState: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onHandleScroll = this.onHandleScroll.bind(this);
  }

  componentDidMount() {
    this.restoreScroll();
  }

  componentDidUpdate(prevProps) {
    // This would affect the overall scroll size. We don't bother, let's move back to bottom
    if (prevProps.renderEmbeds !== this.props.renderEmbeds ||
      prevProps.inlineImages !== this.props.inlineImages) {
      this.scrollToBottom();
    } // Last message has changed.
    else if (this.props.messages.last() !== prevProps.messages.last()) {
      if (prevProps.messagesState.loadingMore) {
        this.restoreScroll();
      }

      const latestMessage = this.props.messages.last();
      const currentUser = this.props.viewer;
      if (latestMessage && latestMessage.user.id === currentUser.id || this.isAtBottom()) {
        this.scrollToBottom();
      }
    }
  }

  onHandleScroll() {
    // Nothing to compute about dimensions. It's empty
    if (this.props.messages.size === 0) {
      return;
    }

    const { scroller } = this.refs;
    // At the top of the scroller node and its larger than the viewport.
    if (scroller.scrollTop === 0 && scroller.scrollHeight > scroller.offsetHeight) {
      if (this.props.messagesState.hasMore && !this.props.messages.loadingMore) {
        this.loadMore();
      }
    }

    // If at the bottom we can clear dimensions.
    if (scroller.scrollHeight === scroller.scrollTop + scroller.offsetHeight) {
      clearDimensions(this.props.room);
    }
    // Otherwise keep track of the current dimensions to use to offset calculation.
    else {
      updateDimensions(this.props.room, {
        scrollTop: scroller.scrollTop
      });
    }
  }

  loadMore() {
    RoomActionCreators.fetchMessages(
      this.props.room.id,
      this.props.messages.first().dateCreated.toISOString()
    );
  }

  restoreScroll() {
    // If the user previously scrolled then restore their position.
    const { scrollTop } = this.props.dimensions;
    if (scrollTop !== null) {
      this.scrollTo(scrollTop);
    } else {
      this.scrollToBottom();
    }
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

  regroupMessages(messages) {
    const messageGroups = [];
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
    const messageStream = [];
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

  render() {
    const messageGroup = this.regroupMessages(this.props.messages);
    const messageGroupFinal = messageGroup.map(({ type, content }, i) => {
      if (type === MessageStreamTypes.DIVIDER_TIME_STAMP) {
        return <MessageTimestamp key={i}><h4>{content}</h4></MessageTimestamp>;
      }

      return (
        <MessageGroup
          key={content[0].id}
          viewer={this.props.viewer}
          renderEmbeds={this.props.renderEmbeds}
          inlineImages={this.props.inlineImages}
          messages={content}
        />
      );
    });

    if (this.props.messagesState.loadingMore) {
      messageGroupFinal.unshift(
        <div
          key="loading-more"
          className="message-loading-more flex-horizontal"
        >
          <img
            className="spinner"
            src="/images/spinner.gif"
            alt="Loading more messages..."
          />
        </div>
      );
    } else if (this.props.messagesState.hasMore) {
      messageGroupFinal.unshift(
        <div
          key="has-more"
          className="message-has-more"
        ></div>
      );
    } else {
      messageGroupFinal.unshift(
        <WelcomeMessage key="welcome-message" room={this.props.room} />
      );
    }

    return (
      <section
        className="panel panel--contrast flex-vertical flex-spacer"
        ref="scroller"
        onScroll={this.onHandleScroll}
      >
        <div className="panel-wrapper messages">{messageGroupFinal}</div>
      </section>
    );
  }
}
