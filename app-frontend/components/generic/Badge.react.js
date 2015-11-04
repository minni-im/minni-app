import React from "react";

export default class Badge extends React.Component {
  render() {
    const { number } = this.props;
    if (number > 0) {
      return <span className="badge">{number}</span>;
    }
    return false;
  }
}

Badge.propTypes = {
  number: React.PropTypes.number.isRequired
};
