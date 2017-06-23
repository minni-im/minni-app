import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class RadioGroup extends React.PureComponent {
  static propTypes = {
    values: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        selected: PropTypes.bool,
      })
    ).isRequired,
    selected: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    onChange: () => {},
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     value: props.selected,
  //   };
  // }

  onChange(evt) {
    const { value, dataset } = evt.target;
    const { valueType } = dataset;
    let newValue = value;
    if (valueType === "number") {
      newValue = parseInt(value, 10);
    }
    // this.setState(() => {
    //   this.props.onChange({ value: newValue });
    //   return { value: newValue };
    // });
    this.props.onChange({ value: newValue });
  }

  render() {
    const { disabled, values, name, selected } = this.props;
    // const { value } = this.state;
    const classNames = classnames("x-radio-group", {
      "x-radio-group--disabled": disabled,
    });

    return (
      <div className={classNames}>
        {values.map(item =>
          (<div
            className={classnames("x-radio-group-item", {
              "x-radio-group-item--checked": item.value === selected,
            })}
            key={item.value}
          >
            <label className="flex-horizontal">
              <div className="x-radio-group-item-tick">
                <input
                  type="radio"
                  name={name}
                  value={item.value}
                  data-value-type={typeof item.value}
                  checked={item.value === selected}
                  disabled={disabled}
                  onChange={e => this.onChange(e)}
                />

                {item.value === selected &&
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fillRule="evenodd">
                      <polyline strokeWidth="2" points="3.5 9.5 7 13 15 5" />
                    </g>
                  </svg>}

              </div>
              <div className="flex-spacer">{item.label}</div>
            </label>
          </div>)
        )}
      </div>
    );
  }
}
