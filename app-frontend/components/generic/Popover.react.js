import React from "react";
import keyMirror from "keymirror";
import classnames from "classnames";

class Popover extends React.Component {
  static TYPE = keyMirror({
    UP: null,
    DOWN: null
  })

  static propTypes = {
    className: React.PropTypes.string,
    buttonComponent: React.PropTypes.element.isRequired,
    direction: React.PropTypes.oneOf(Object.keys(Popover.TYPE)),
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
  }

  static defaultProps = {
    direction: Popover.TYPE.UP
  }

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.focusOnOpen = false;
  }

  state = {
    visible: false
  }

  componentDidUpdate() {
    if (this.focusOnOpen) {
      this.focusFirstElement();
      this.focusOnOpen = false;
    }
  }

  onKeyDown(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  onButtonClicked(event) {
    event.stopPropagation();
    if (this.state.visible) {
      this.close();
    } else {
      this.open();
    }
  }

  onBlur(event) {
    const target = event.nativeEvent.relatedTarget;
    if (target && this.popoverContainer.contains(target)) {
      return;
    }
    this.setState({
      visible: false
    });
  }

  open() {
    this.focusOnOpen = true;
    this.setState({
      visible: true
    });
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  close() {
    this.setState({
      visible: false
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  focusFirstElement() {
    let matches = this.popover.querySelectorAll("[tabIndex], imput, a");
    matches = [].slice.call(matches)
      .filter((node) => {
        if (node.tabIndex > 0) {
          return node.tabIndex;
        } else if (["INPUT", "A"].indexOf(node.nodeName) !== -1) {
          return 10000000;
        }
        return 10000001;
      })
      .sort();

    if (matches.length) {
      matches[0].focus();
    }
  }

  render() {
    const wrapperComponent = (
      <div onClick={this.onButtonClicked}>
        {this.props.buttonComponent}
      </div>
    );
    let popoverComponent = [];
    if (this.state.visible) {
      popoverComponent = (
        <div
          className={classnames("popover", {
            [`popover-${this.props.direction}`.toLowerCase()]: true
          })}
          ref={(popover) => { this.popover = popover; }}
        >
          {this.props.children}
        </div>
      );
    }

    return (
      <div
        className={classnames("popover-container", this.props.className)}
        ref={(popoverContainer) => { this.popoverContainer = popoverContainer; }}
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      >
        {wrapperComponent}
        {popoverComponent}
      </div>
    );
  }
}

export default Popover;
