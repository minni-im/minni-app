import React from "react";
import PropTypes from "prop-types";
import keyMirror from "keymirror";
import classnames from "classnames";
import clickOutside from "click-outside";

class Popover extends React.Component {
  static TYPE = keyMirror({
    UP: null,
    DOWN: null,
  });

  static propTypes = {
    className: PropTypes.string,
    buttonComponent: PropTypes.element.isRequired,
    direction: PropTypes.oneOf(Object.keys(Popover.TYPE)),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    direction: Popover.TYPE.UP,
  };

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onButtonClicked = this.onButtonClicked.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.focusOnOpen = false;
  }

  state = {
    visible: false,
  };

  componentDidMount() {
    this.clickOutsideHandler = clickOutside(this.popoverContainer, this.onClickOutside.bind(this));
  }

  componentDidUpdate() {
    if (this.focusOnOpen) {
      this.focusFirstElement();
      this.focusOnOpen = false;
    }
  }

  componentWillUnmount() {
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler();
    }
  }

  onClickOutside() {
    this.close();
  }

  onKeyDown(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  onButtonClicked() {
    if (this.state.visible) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.focusOnOpen = true;
    this.setState({
      visible: true,
    });
    if (this.props.onOpen) {
      this.props.onOpen();
    }
  }

  close() {
    this.setState({
      visible: false,
    });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  focusFirstElement() {
    let matches = this.popover.querySelectorAll("[tabIndex], input, a");
    matches = [].slice
      .call(matches)
      .map((node) => {
        if (node.tabIndex > 0) {
          return [node.tabIndex, node];
        } else if (["INPUT", "A"].indexOf(node.nodeName) !== -1) {
          return [10000000, node];
        }
        return [10000001, node];
      })
      .sort((a, b) => {
        if (a[0] === b[0]) {
          return 0;
        }
        return a[0] < b[0] ? -1 : 1;
      })
      .map(data => data[1]);

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
            [`popover-${this.props.direction}`.toLowerCase()]: true,
          })}
          ref={(popover) => {
            this.popover = popover;
          }}
        >
          {React.cloneElement(this.props.children)}
        </div>
      );
    }

    return (
      <div
        className={classnames("popover-container", this.props.className)}
        ref={(popoverContainer) => {
          this.popoverContainer = popoverContainer;
        }}
        onKeyDown={this.onKeyDown}
      >
        {wrapperComponent}
        {popoverComponent}
      </div>
    );
  }
}

export default Popover;
