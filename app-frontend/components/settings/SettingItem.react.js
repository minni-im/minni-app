import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import UserSettingsStore from "../../stores/UserSettingsStore";

export default class SettingItem extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    setting: PropTypes.string.isRequired,
    default: PropTypes.any,
    desc: PropTypes.string,
    children: PropTypes.node,
    onChange: PropTypes.func.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
  };

  static defaultProps = {
    choices: [{ label: "On", value: true }, { label: "Off", value: false }],
  };

  constructor(props) {
    super(props);
    this.onToggleClick = this.onToggleClick.bind(this);
  }

  state = {
    value: this.getValueFromStore(this.props.setting, this.props.default),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.setting !== this.props.setting) {
      this.setState({
        value: this.getValueFromStore(nextProps.setting, nextProps.default),
      });
    }
  }

  onToggleClick(event) {
    if (event.target.tagName.toLowerCase() !== "span") {
      return;
    }
    const { value, valueType } = event.target.dataset;
    let newValue = value;
    if (valueType === "number") {
      newValue = parseInt(value, 10);
    } else if (valueType === "boolean") {
      newValue = value === "true";
    }
    if (newValue !== this.state.value) {
      const oldValue = this.state.value;
      this.setState({
        value: newValue,
      });
      this.props.onChange(this.props.setting, newValue, oldValue);
    }
  }

  getValueFromStore(key, fallback) {
    return UserSettingsStore.getValue(key, fallback);
  }

  render() {
    const { title, desc, children, choices } = this.props;
    let description;
    if (children) {
      description = <em>{children}</em>;
    } else {
      description = desc ? <em dangerouslySetInnerHTML={{ __html: desc }} /> : false;
    }
    return (
      <div className="setting-item flex-horizontal">
        <div className="setting-item--info flex-spacer">
          <div>{title}</div>
          <div>{description}</div>
        </div>
        <div className="setting-item--toggle" onClick={this.onToggleClick}>
          {choices.map(({ label, value }, index) =>
            (<span
              key={`setting-${index}`}
              data-value={value}
              data-value-type={typeof value}
              className={classnames("button", "button-small", {
                "button-highlight": value === this.state.value,
              })}
            >
              {label}
            </span>)
          )}
        </div>
      </div>
    );
  }
}
