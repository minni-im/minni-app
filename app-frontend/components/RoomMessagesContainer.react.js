import React from "react";
import { Container } from "flux/utils";

import RoomMessages from "./RoomMessages.react";

import RoomStore from "../stores/RoomStore";

import Logger from "../libs/Logger";
const logger = Logger.create("RoomMessagesContainer");

class RoomMessagesContainer extends React.Component {
  static getStores() {
    return [ RoomStore ];
  }

  static calculateState(prevState, prevProps) {
    let roomSlugs = prevProps.params.roomSlug.split(",");
    return {
      rooms: RoomStore.getRooms(roomSlugs)
    };
  }

  render() {
    return <main className="room">
      {this.state.rooms.map(room => {
        return <RoomMessages key={room.id} room={room} />;
      })}
    </main>;
  }
}

const container = Container.create(RoomMessagesContainer, { withProps: true });
export default container;
