import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const padLeft = number => (number < 10 ? `0${number}` : number);

export default class Countdown extends React.Component {
  static propTypes = {
    expiration: PropTypes.instanceOf(Date).isRequired,
  };

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { expiration } = this.props;
    if (expiration === +Infinity) {
      return <span className="countdown">{"\u221E"}</span>;
    }
    let duration = Math.max(0, expiration.getTime() - Date.now());
    if (duration === 0) {
      clearInterval(this.interval);
      return <span>N/A</span>;
    }
    duration = moment.duration(duration, "milliseconds");
    return (
      <span>
        {padLeft(duration.hours())}:{padLeft(duration.minutes())}:{padLeft(duration.seconds())}
      </span>
    );
  }
}
