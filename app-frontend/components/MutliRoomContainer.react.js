import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";

import { deselectRooms } from "../actions/RoomActionCreators";

import Rooms from "./RoomsContainer.react";

class MutliRoomContainer extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  componentWillUnmount() {
    deselectRooms();
  }

  render() {
    return <Route path={`${this.props.match.path}/:roomSlugs`} component={Rooms} />;
  }
}

export default MutliRoomContainer;
