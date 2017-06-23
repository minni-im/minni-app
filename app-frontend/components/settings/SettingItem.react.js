import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import RadioSwitch from "../generic/RadioSwitch.react";
import RadioGroup from "../generic/RadioGroup.react";

import UserSettingsStore from "../../stores/UserSettingsStore";

const DEFAULT_SWITCH = [{ label: "On", value: true }, { label: "Off", value: false }];

export default class SettingItem extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    setting: PropTypes.string.isRequired,
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
    choices: DEFAULT_SWITCH,
  };

  constructor(props) {
    super(props);
    this.onSwitchClick = this.onSwitchClick.bind(this);
    this.onGroupClick = this.onGroupClick.bind(this);
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

  onSwitchClick() {
    this.setState((state) => {
      const value = !state.value;
      this.props.onChange(this.props.setting, value, state.value);
      return { value };
    });
  }

  onGroupClick({ value }) {
    this.setState((state) => {
      this.props.onChange(this.props.setting, value, state.value);
      return { value };
    });
  }

  getValueFromStore(key, fallback) {
    return UserSettingsStore.getValue(key, fallback);
  }

  render() {
    const { title, desc, children, choices, setting } = this.props;
    let description;
    if (children) {
      description = <em>{children}</em>;
    } else {
      description = desc ? <em dangerouslySetInnerHTML={{ __html: desc }} /> : false;
    }

    let choiceList;
    if (choices === DEFAULT_SWITCH) {
      choiceList = <RadioSwitch value={this.state.value} onChange={this.onSwitchClick} />;
    } else {
      choiceList = (
        <RadioGroup
          name={setting}
          values={choices}
          selected={this.state.value}
          onChange={this.onGroupClick}
        />
      );
    }

    return (
      <div
        className={classnames("setting-item", {
          "flex-horizontal": choices === DEFAULT_SWITCH,
          "flex-vertical": choices !== DEFAULT_SWITCH,
        })}
      >
        <div className="setting-item--info flex-spacer">
          <div>{title}</div>
          <div>{description}</div>
        </div>
        {choiceList}
      </div>
    );
  }
}
