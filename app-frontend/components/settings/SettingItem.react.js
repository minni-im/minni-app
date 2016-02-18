import React, { PropTypes } from "react";
import classnames from "classnames";

import UserSettingsStore from "../../stores/UserSettingsStore";

import { noop } from "../../utils/FunctionUtils";

export default class SettingItem extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      value: this.getValueFromStore( this.props.setting )
    };
    this.onToggleClick = this.onToggleClick.bind( this );
  }

  getValueFromStore( key ) {
    return UserSettingsStore.getValue( key );
  }

  componentWillReceiveProps(nextProps) {
    if ( nextProps.setting !== this.props.setting ) {
      this.setState( {
        value: this.getValueFromStore(nextProps.setting)
      } );
    }
  }

  render() {
    const { title, desc, children, choices } = this.props;
    let description = (
      children ?
      <em>{ children }</em> : (
        desc ?
          <em dangerouslySetInnerHTML={ { __html: desc } } /> :
          false
      )
    );
    return (
      <div className="setting-item flex-horizontal">
        <div className="setting-item--info flex-spacer">
          <div>{ title }</div>
          <div>{ description }</div>
        </div>
        <div className="setting-item--toggle" onClick={ this.onToggleClick }>
          {choices.map(( { label, value }, index ) => {
            return (
              <span key={ `setting-${index}` }
                data-value={ value }
                data-value-type={ typeof value }
                className={ classnames( "button", "button-small", {
                  "button-highlight": value === this.state.value
                } ) }
              >{ label }</span>
            );
          })}
        </div>
      </div>
    );
  }

  onToggleClick( event ) {
    const { value, valueType } = event.target.dataset;
    let newValue = value;
    if ( valueType === "number" ) {
      newValue = parseInt( value, 10 );
    } else if ( valueType === "boolean" ) {
      newValue = value === "true";
    }
    if ( newValue !== this.state.value ) {
      const oldValue = this.state.value;
      this.setState( {
        value: newValue
      } );
      this.props.onChange( this.props.setting, newValue, oldValue );
    }

  }
}


SettingItem.PropTypes = {
  setting: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  onChange: PropTypes.func,
  choices: PropTypes.array(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired
  }))
};

SettingItem.defaultProps = {
  onChange: noop,
  choices: [
    { label: "On", value: true },
    { label: "Off", value: false }
  ]
};
