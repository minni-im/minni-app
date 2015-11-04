import React from "react";

export default class Progress extends React.Component {
  render() {
    return <div className="progress">
      <div className="progress-bar" style={{width: `${this.props.percent}%`}}></div>
    </div>;
  }
}

Progress.propTypes = {
  percent: React.PropTypes.number
};

Progress.defaultProps = {
  percent: 0
};
