import React, { Component } from "react";
import classnames from "classnames";

export default class extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  state = {
    confirmed: false
  }

  onClick(event) {
    console.log("Confirm Button CLICKED");
    if (!this.state.confirmed) {
      this.setState({
        confirmed: true
      });
      event.preventDefault();
    }
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    return (
      <span
        className={
          classnames(
            "button-confirm",
            { "button-confirm--active": this.state.confirmed }
          )
        }
        onClick={this.onClick}
      >
        {children[0]}
        {this.state.confirmed ? children[1] : false}
      </span>
    );
  }
}
