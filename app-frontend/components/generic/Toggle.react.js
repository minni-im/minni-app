import React from "react";
import PropTypes from "prop-types";
import keyMirror from "keymirror";
import classnames from "classnames";

const TYPE = keyMirror({
  BOOLEAN: null,
  ENUM: null,
});

const LABEL = {
  on: "ON",
  off: "OFF",
};

let idNum = 0;

export default class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  render() {
    const id = this.props.id || `toggle-${idNum++}`;
    const classNames = classnames("form-toggle", this.props.className);
    return (
      <span>
        <input
          className={classNames}
          type="checkbox"
          checked={this.props.checked}
          readOnly
          disabled={this.props.disabled}
        />
        <label className="form-toggle__label" htmlFor={id}>
          <span
            className="form-toggle__switch"
            disabled={this.props.disabled}
            id={id}
            onKeyDown={this.onKeyDown}
            onClick={this.props.onChange}
            role="checkbox"
            aria-checked={this.props.checked}
            aria-label={this.props["aria-label"]}
            tabIndex={this.props.disabled ? -1 : 0}
          />
          {this.props.children}
        </label>
      </span>
    );
  }

  onKeyDown(event) {
    if (!this.props.disabled) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.props.onChange();
      }
    }
  }
}

Toggle.Type = TYPE;

Toggle.PropTypes = {
  onChange: PropTypes.func,
  type: PropTypes.oneOf(Object.keys(TYPE)),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

Toggle.defaultProps = {
  type: TYPE.NORMAL,
  checked: false,
  disabled: false,
};
