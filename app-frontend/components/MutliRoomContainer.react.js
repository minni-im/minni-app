import React from "react";
import PropTypes from "prop-types";
import { Match } from "react-router";

import { deselectRooms } from "../actions/RoomActionCreators";

import Rooms from "./RoomsContainer.react";

export default class MutliRoomContainer extends React.Component {
  static propTypes = {
    pattern: PropTypes.string,
  };

  componentWillUnmount() {
    deselectRooms();
  }

  render() {
    return <Match pattern={`${this.props.pattern}/:roomSlugs`} component={Rooms} />;
  }
}
