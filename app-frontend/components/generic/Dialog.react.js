import ReactDom from "react-dom";
import React, { PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classnames from "classnames";
import clickOutside from "click-outside";

import RootChild from "./RootChild.react";

import { noop } from "../../utils/FunctionUtils";

class DialogBase extends React.Component {
  componentDidMount() {
    this.focusTimeout = setTimeout(() => {
      this.focusTimeout = false;
      if (this.props.autoFocus) {
        ReactDom.findDOMNode(this.refs.content).focus();
      }

      this.unbindClickHandler = clickOutside(ReactDom.findDOMNode(this.refs.dialog), this._onBackgroundClick.bind(this));
    }, 10);
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.focusTimeout = false;
    }

    if (this.unbindClickHandler) {
      this.unbindClickHandler();
      this.unbindClickHandler = null;
    }
  }

  render() {
    const baseClassName = this.props.baseClassName;
    let dialogClassName = baseClassName;
    const backdropClassName = `${dialogClassName}__backdrop`;
    const headerClassName = `${dialogClassName}__header`;
    const contentClassName = `${dialogClassName}__content`;

    if (this.props.additionalClassNames) {
      dialogClassName = classnames(this.props.additionalClassNames, dialogClassName);
    }

    return (
      <div
        className={backdropClassName}
        ref="backdrop"
      >
        <div
          className={dialogClassName}
          ref="dialog"
          role="dialog"
        >
          <header className={headerClassName}>
            <div className="header-info">
              <h2>{this.props.title}</h2>
              <h3>{this.props.subtitle}</h3>
            </div>
            {this._renderButtonsBar()}
          </header>
          <div
            className={
              classnames(this.props.className, contentClassName)
            }
            ref="content"
            tabIndex="-1"
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  _renderButtonsBar() {
    const baseClassName = this.props.baseClassName;
    const buttonsClassName = `${baseClassName}__action-buttons`;

    if (!this.props.buttons) {
      return null;
    }

    return (
      <div
        className={buttonsClassName}
        ref="actionButtons"
      >
        {this.props.buttons.map(this._renderButton, this)}
      </div>
    );
  }

  _renderButton(button, index) {
    if (React.isValidElement(button)) {
      return React.cloneElement(
        button,
        {
          key: `dialog-button-${index}`,
          onClick: () => {
            console.log("I CAN HAZ CLICK");
          }
        }
      );
    }

    const labelClass = `${this.props.baseClassName}__button-label`;
    const buttonClasses = this._getButtonClasses(button);
    const clickHandler = this._onButtonClick.bind(this, button);

    return (
      <button
        key={button.action}
        className={buttonClasses}
        onClick={clickHandler}
        disabled={!! button.disabled}
      >
        <span className={labelClass}>{button.label}</span>
      </button>
    );
  }

  _getButtonClasses(button) {
    const classes = {
      [button.className || "button"]: true
    };

    if (button.isPrimary || this.props.buttons.length === 1) {
      classes["button-primary"] = true;
    }

    if (button.additionalClassNames) {
      classes[button.additionalClassNames] = true;
    }

    return classnames(classes);
  }

  _onBackgroundClick(event) {
    const isBackdropClicked = (
      ! this.refs ||
      ReactDom.findDOMNode(this.refs.backdrop).contains(event.target)
    );

    if (!isBackdropClicked) {
      return;
    }

    this.props.onClickOutside(event);

    if (!event.defaultPrevented) {
      this._close();
    }
  }

  _onButtonClick(button) {
    if (button.onClick) {
      button.onClick(this._close.bind(this, button.action));
      return;
    }

    this._close(button.action);
  }

  _close(action) {
    if (this.props.onDialogClose) {
      this.props.onDialogClose(action);
    }
  }
}

DialogBase.defaultProps = {
  baseClassName: "dialog",
  autoFocus: true,
  title: "Dialog",
  subtitle: ""
};


export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  render() {
    const { visible, baseClassName, enterTimeout, leaveTimeout } = this.props;
    return (
      <RootChild>
        <ReactCSSTransitionGroup
          transitionName={baseClassName}
          component="div"
          transitionEnterTimeout={enterTimeout}
          transitionLeaveTimeout={leaveTimeout}
        >
          {visible && (
            <DialogBase {...this.props} key="dialog" onDialogClose={this.onDialogClose} />
          )}
        </ReactCSSTransitionGroup>
      </RootChild>
    );
  }

  onDialogClose(action) {
    if (this.props.onClose) {
      this.props.onClose(action);
    }
  }
}

Dialog.PropTypes = {
  visible: PropTypes.bool,
  baseClassName: PropTypes.string,
  enterTimeout: PropTypes.number,
  leaveTimeout: PropTypes.number,
  onClose: React.PropTypes.func,
  onClosed: React.PropTypes.func,
  onClickOutside: React.PropTypes.func
};

Dialog.defaultProps = {
  visible: false,
  baseClassName: "dialog",
  enterTimeout: 200,
  leaveTimeout: 200,
  onClose: noop,
  onClosed: noop,
  onClickOutside: noop
};
