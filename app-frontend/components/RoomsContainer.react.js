import React from "react";
import { Container } from "flux/utils";
import classnames from "classnames";

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
      rooms: RoomStore.getRooms(...roomSlugs)
    };
  }

  render() {
    const size = this.state.rooms.size;
    const classNames = classnames("room", {
      "split-rooms": this.state.rooms.size > 1
    });
    return <main className={classNames}>
      {this.state.rooms.map(room => {
        return <Room key={room.id} room={room} />;
      }).toArray()}
    </main>;
  }
}

const container = Container.create(RoomsContainer);
export default container;
