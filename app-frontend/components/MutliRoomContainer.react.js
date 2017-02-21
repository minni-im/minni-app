import React from "react";
import { Match } from "react-router";

import { deselectRooms } from "../actions/RoomActionCreators";

import Rooms from "./RoomsContainer.react";

export default class MutliRoomContainer extends React.Component {
  static propTypes = {
    pattern: React.PropTypes.string
  };

  componentWillUnmount() {
    deselectRooms();
  }

  render() {
    return <Match pattern={`${this.props.pattern}/:roomSlugs`} component={Rooms} />;
  }
}
