import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const ON = "on";
const OFF = "off";

export default class RadioSwitch extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? ON : OFF,
    };
  }

  onChange(evt) {
    this.setState((state) => {
      const result = this.props.onChange(evt);
      if (result !== false) {
        return {
          value: state.value === ON ? OFF : ON,
        };
      }
      return state;
    });
  }

  render() {
    const { disabled } = this.props;
    const { value } = this.state;
    const classNames = classnames("x-radio-switch", {
      "x-radio-switch--disabled": disabled,
      "x-radio-switch--checked": value === ON,
    });

    return (
      <div className={classNames}>
        <input
          type="checkbox"
          defaultValue={value}
          disabled={disabled}
          onChange={e => this.onChange(e)}
        />
        <div />
      </div>
    );
  }
}
