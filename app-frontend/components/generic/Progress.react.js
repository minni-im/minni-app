import React from "react";
import PropTypes from "prop-types";

export default class Progress extends React.Component {
  render() {
    return (
      <div className="progress">
        <div className="progress-bar" style={{ width: `${this.props.percent}%` }} />
      </div>
    );
  }
}

Progress.propTypes = {
  percent: PropTypes.number,
};

Progress.defaultProps = {
  percent: 0,
};
