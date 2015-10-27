import React from "react";
import { Container } from "flux/utils";

import Room from "./Room.react";

import RoomStore from "../stores/RoomStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomMessagesContainer");

class RoomsContainer extends React.Component {
  static getStores() {
    return [ RoomStore, SelectedRoomStore ];
  }

  static calculateState() {
    let roomSlugs = SelectedRoomStore.getRooms();
    return {
      rooms: RoomStore.getRooms(...roomSlugs)
    };
  }

  render() {
    return <main className="room">
      {this.state.rooms.toArray().map(room => {
        return <Room key={room.id} room={room} />;
      })}
    </main>;
  }
}

const container = Container.create(RoomsContainer, { withProps: true });
export default container;
