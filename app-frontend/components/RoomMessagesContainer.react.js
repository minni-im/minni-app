import React from "react";
import { Container } from "flux/utils";

import RoomMessages from "./RoomMessages.react";

import RoomStore from "../stores/RoomStore";

class RoomMessagesContainer extends React.Component {
  static getStores() {
    return [ RoomStore ];
  }

  static calculateState(prevState, prevProps) {
    let roomSlugs = prevProps.params.roomSlug.split(",");
    let rooms = {};
    for (let roomSlug of roomSlugs) {
      rooms[roomSlug] = RoomStore.get(roomSlug);
    }
    return {
      slugs: roomSlugs,
      rooms
    };
  }

  render() {
    return <main className="room">
      {this.state.slugs.map(slug => {
        const room = this.state.rooms[slug];
        return <RoomMessages key={room.id} room={room} />;
      })}
    </main>;
  }
}

const container = Container.create(RoomMessagesContainer, { withProps: true });
export default container;
