import React from "react";
import PropTypes from "prop-types";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classnames from "classnames";
import clickOutside from "click-outside";
import Combokeys from "combokeys";
import RootChild from "./RootChild.react";

class DialogBase extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    baseClassName: PropTypes.string,
    additionalClassNames: PropTypes.string,
    autoFocus: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    onDialogClose: PropTypes.func,
    onClickOutside: PropTypes.func,
    buttons: PropTypes.arrayOf(PropTypes.any),
  };

  static defaultProps = {
    baseClassName: "dialog",
    autoFocus: true,
    title: "Dialog",
    subtitle: "",
  };

  componentDidMount() {
    this.focusTimeout = setTimeout(() => {
      this.focusTimeout = false;
      if (this.props.autoFocus) {
        this.content.focus();
      }

      this.unbindClickHandler = clickOutside(this.dialog, this.onBackgroundClick.bind(this));
    }, 10);
    document.body.classList.add("dialog-open");
    this.combokeys = new Combokeys(document.documentElement);
    this.combokeys.bind("esc", () => this.close(), "keyup");
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
    document.body.classList.remove("dialog-open");
    this.combokeys.detach();
  }

  onBackgroundClick(event) {
    const isBackdropClicked = this.backdrop.contains(event.target);
    if (!isBackdropClicked) {
      return;
    }
    if (this.props.onClickOutside) {
      this.props.onClickOutside(event);
    }
    if (!event.defaultPrevented) {
      this.close();
    }
  }

  onButtonClick(button) {
    if (button.onClick) {
      button.onClick(this.close.bind(this, button.action));
      return;
    }

    this.close(React.isValidElement(button) ? button.props.action : button.action);
  }

  getButtonClasses(button) {
    const classes = {
      [button.className || "button"]: true,
    };

    if (button.isPrimary || this.props.buttons.length === 1) {
      classes["button-primary"] = true;
    }

    if (button.additionalClassNames) {
      classes[button.additionalClassNames] = true;
    }

    return classnames(classes);
  }

  close(action) {
    if (this.props.onDialogClose) {
      this.props.onDialogClose(action);
    }
  }

  renderButtonsBar() {
    const baseClassName = this.props.baseClassName;
    const buttonsClassName = `${baseClassName}__action-buttons`;

    if (!this.props.buttons) {
      return null;
    }

    return (
      <div
        className={buttonsClassName}
        ref={(actionButtons) => {
          this.actionButtons = actionButtons;
        }}
      >
        {this.props.buttons.map(this.renderButton, this)}
      </div>
    );
  }

  renderButton(button, index) {
    const clickHandler = this.onButtonClick.bind(this, button);

    if (React.isValidElement(button)) {
      return React.cloneElement(button, {
        key: `dialog-button-${index}`,
        onClick: clickHandler,
      });
    }

    const labelClass = `${this.props.baseClassName}__button-label`;
    const buttonClasses = this.getButtonClasses(button);

    return (
      <button
        key={button.action}
        className={buttonClasses}
        onClick={clickHandler}
        disabled={!!button.disabled}
      >
        <span className={labelClass}>{button.label}</span>
      </button>
    );
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
        ref={(backdrop) => {
          this.backdrop = backdrop;
        }}
      >
        <div
          className={dialogClassName}
          ref={(dialog) => {
            this.dialog = dialog;
          }}
          role="dialog"
        >
          <header className={headerClassName}>
            <div className="header-info">
              <h2>{this.props.title}</h2>
              <h3>{this.props.subtitle}</h3>
            </div>
            {this.renderButtonsBar()}
          </header>
          <div
            className={classnames(this.props.className, contentClassName)}
            ref={(content) => {
              this.content = content;
            }}
            tabIndex="-1"
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default class Dialog extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    baseClassName: PropTypes.string,
    enterTimeout: PropTypes.number,
    leaveTimeout: PropTypes.number,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
    baseClassName: "dialog",
    enterTimeout: 200,
    leaveTimeout: 200,
  };

  constructor(props) {
    super(props);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  onDialogClose(action) {
    if (this.props.onClose) {
      this.props.onClose(action);
    }
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
          {visible &&
            <DialogBase {...this.props} key="dialog" onDialogClose={this.onDialogClose} />}
        </ReactCSSTransitionGroup>
      </RootChild>
    );
  }
}
