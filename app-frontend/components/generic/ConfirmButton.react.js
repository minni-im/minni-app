import React, { Component } from "react";
import classnames from "classnames";

export default class ConfirmButton extends Component {
  static propTypes = {
    action: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onClickToggle = this.onClickToggle.bind(this);
  }

  state = {
    confirmed: false
  }

  onClick(event) {
    this.props.onClick(event);
  }

  onClickToggle() {
    this.setState({
      confirmed: !this.state.confirmed
    });
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    const icon = React.cloneElement(children[0], {
      key: `${this.props.action}-icon`,
      onClick: this.onClickToggle
    });
    const action = React.cloneElement(children[1], {
      key: `${this.props.action}-action`,
      onClick: this.onClick
    });
    return (
      <span
        className={
          classnames(
            "button-confirm",
            { "button-confirm--active": this.state.confirmed }
          )
        }
      >
      {icon}
      {action}
      </span>
    );
  }
}
