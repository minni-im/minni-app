import React from "react";
import PropTypes from "prop-types";
import { Container } from "flux/utils";
import classnames from "classnames";
import DocumentTitle from "react-document-title";

import Room from "./Room.react";

import ConnectionStore from "../stores/ConnectionStore";
import RoomStore from "../stores/RoomStore";

import { selectRoom } from "../actions/RoomActionCreators";

function activateSelectedRoom(props) {
  const { params } = props.match;
  const { accountSlug, roomSlugs } = params;
  selectRoom(accountSlug, roomSlugs.split(","));
}

class RoomsContainer extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  static getStores() {
    return [RoomStore, ConnectionStore];
  }

  static calculateState(prevState, prevProps) {
    const roomSlugs = prevProps.match.params.roomSlugs.split(",");
    return {
      rooms: RoomStore.getRoomsBySelectedAccount(...roomSlugs),
      connection: ConnectionStore.isConnected(),
    };
  }

  componentWillMount() {
    activateSelectedRoom(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.roomSlugs !== this.props.match.params.roomSlugs) {
      activateSelectedRoom(nextProps);
    }
  }

  render() {
    const { size } = this.state.rooms;
    const classNames = classnames("room", "flex-spacer", "flex-horizontal", {
      "split-rooms": size > 1,
      [`split-rooms-${size}`]: size > 1,
    });
    const title = this.state.rooms.map(room => room.name).join(" | ");

    return (
      <DocumentTitle title={`${title} • ${window.Minni.name}`}>
        <main className={classNames}>
          {this.state.rooms
            .toArray()
            .map(room =>
              (<Room
                key={room.id}
                room={room}
                multiRooms={size > 1}
                connection={this.state.connection}
              />)
            )}
        </main>
      </DocumentTitle>
    );
  }
}

const container = Container.create(RoomsContainer, { withProps: true });
export default container;
