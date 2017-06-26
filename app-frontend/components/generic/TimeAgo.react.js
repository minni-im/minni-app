/* eslint-disable no-nested-ternary */
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default class TimeAgo extends React.PureComponent {
  static propTypes = {
    datetime: PropTypes.instanceOf(moment).isRequired,
    live: PropTypes.bool,
    className: PropTypes.string,
    title: PropTypes.string,
    format: PropTypes.string,
  };

  static defaultProps = {
    live: true,
    className: "",
    title: "",
    format: "LLLL",
  };

  componentDidMount() {
    if (this.props.live) {
      this.tick(true);
    }
  }

  componentDidUpdate(lastProps) {
    if (this.props.live !== lastProps.live || this.props.datetime !== lastProps.datetime) {
      if (!this.props.live && this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.tick();
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  timeoutId = undefined;

  tick(refresh) {
    if (!this.props.live) {
      return;
    }
    const now = moment();
    const seconds = now.diff(this.props.datetime, "seconds");

    const unboundPeriod = seconds < MINUTE
      ? 1000
      : seconds < HOUR ? 1000 * MINUTE : seconds < DAY ? 1000 * HOUR : 0;

    const period = Math.min(Math.max(unboundPeriod, 0), Infinity);

    if (period) {
      this.timeoutId = setTimeout(() => {
        this.tick();
      }, period);
    }
    if (!refresh) {
      this.forceUpdate();
    }
  }

  render() {
    // TODO: This method is clearly a mess. We should not hack into momentjs
    // Maybe we should consider moving to Intl browser APIs
    const { datetime, className, title: propsTitle, format } = this.props;
    const title = propsTitle.length ? propsTitle : datetime.format(format);
    const now = moment();
    const daysDiff = now.diff(datetime, "days");
    const hourFormat = format.length === 4 ? "LT" : "HH:mm";
    return (
      <time className={className} dateTime={datetime.toISOString()} title={title}>
        {daysDiff < 1
          ? datetime.fromNow()
          : datetime.calendar(null, {
            lastDay: `[Yesterday at] ${hourFormat}`,
            lastWeek: `[Last] dddd [at] ${hourFormat}`,
          })}
      </time>
    );
  }
}
