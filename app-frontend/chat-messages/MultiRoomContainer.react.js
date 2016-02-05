import React from "react";

// This component is needed just to be able to display multiple
// rooms at the same time.
// TODO: investigate to make it better/simpler
export default class MutliRoomContainer extends React.Component {
  render() {
    return this.props.children;
  }
}
