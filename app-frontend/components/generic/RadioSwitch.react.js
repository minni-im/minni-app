import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class RadioSwitch extends React.PureComponent {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    onChange: () => {},
  };

  render() {
    const { value, disabled } = this.props;
    const classNames = classnames("x-radio-switch", {
      "x-radio-switch--disabled": disabled,
      "x-radio-switch--checked": value,
    });

    return (
      <div className={classNames}>
        <input
          type="checkbox"
          defaultValue={value}
          disabled={disabled}
          onChange={e => this.props.onChange(e)}
        />
        <div />
      </div>
    );
  }
}
