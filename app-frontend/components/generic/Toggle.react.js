import React from "react";
import keyMirror from "keymirror";
import classnames from "classnames";

const TYPE = keyMirror({
  BOOLEAN: null,
  ENUM: null
});

const LABEL = {
  on: "ON",
  off: "OFF"
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
        <input className={ classNames }
          type="checkbox"
          checked={ this.props.checked }
          readOnly={ true }
          disabled={ this.props.disabled }
          />
        <label className="form-toggle__label" htmlFor={ id }>
          <span className="form-toggle__switch"
            disabled= { this.props.disabled }
            id= { id }
            onKeyDown={ this.onKeyDown }
            onClick={ this.props.onChange }
            role="checkbox"
            aria-checked={ this.props.checked }
            aria-label={ this.props[ "aria-label" ] }
            tabIndex={ this.props.disabled ? -1 : 0 }
            ></span>
          {this.props.children}
        </label>
      </span>
    );
  }

  onKeyDown( event ) {
    if ( ! this.props.disabled ) {
      if ( event.key === 'Enter' || event.key === ' ' ) {
        event.preventDefault();
        this.props.onChange();
      }
    }
  }
}

Toggle.Type = TYPE;

Toggle.PropTypes = {
  onChange: React.PropTypes.func,
  type: React.PropTypes.oneOf(Object.keys(TYPE)),
  list: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    value: React.PropTypes.any
  })),
  checked: React.PropTypes.bool,
  disabled: React.PropTypes.bool
};

Toggle.defaultProps = {
  type: TYPE.NORMAL,
  checked: false,
  disabled: false
};
