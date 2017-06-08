import React from "react";
import PropTypes from "prop-types";

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
  number: PropTypes.number.isRequired,
};
