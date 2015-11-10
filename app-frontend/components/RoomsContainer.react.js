import React from "react";
import { Container } from "flux/utils";

import Room from "./Room.react";

import RoomStore from "../stores/RoomStore";
import SelectedRoomStore from "../stores/SelectedRoomStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomsContainer.react");

class RoomsContainer extends React.Component {
  static getStores() {
    return [ RoomStore, SelectedRoomStore ];
  }

  static calculateState() {
    let roomSlugs = SelectedRoomStore.getRooms();
    return {
      rooms: RoomStore.getRooms(...roomSlugs).toArray()
    };
  }

  render() {
    return <main className="room">
      {this.state.rooms.map(room => {
        return <Room key={room.id} room={room} />;
      })}
    </main>;
  }
}

const container = Container.create(RoomsContainer);
export default container;
