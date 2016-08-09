import React, { PropTypes } from "react";
import UserStore from "../stores/UserStore";

export default function WelcomeMessage(props) {
  const { room } = props;
  const me = UserStore.getConnectedUser();
  const author = UserStore.getUser(room.adminId);
  const dateCreated = room.dateCreated.format("MMMM Do, YYYY");
  return (
    <div className="message-welcome">
      <h3>Welcome to the very beginning of this room's history.</h3>
      <p>
        <em>{room.isUserAdmin(me.id) ?
          "You" :
          author.fullname} created this room on{" "}
          <strong>{dateCreated}</strong>.</em>
      </p>
      <p>
        <em>{room.private ?
          `This is a private room, only ${
            room.usersId.map(
              userId => UserStore.getUser(userId).fullname
            )
            .join(", ")
          } and yourself can join it.` :
          "This room is public, anyone in the team can join it."}</em>
      </p>
    </div>
  );
}

WelcomeMessage.propTypes = {
  room: PropTypes.object.isRequired
};
