import React, { PropTypes } from "react";
import classnames from "classnames";

import { noop } from "../../utils/FunctionUtils";

export default class SettingItem extends React.Component {
  constructor( props ) {
    super( props );

    this.state = {
      value: this.props.settings.getValue( this.props.key )
    };

    this.onToggleClick = this.onToggleClick.bind( this );
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

  }
}


SettingItem.PropTypes = {
  settings: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
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
