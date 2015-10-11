import React from "react";
import classnames from "classnames";
import { FavoriteIcon } from "../utils/Icons";

export default class RoomMessages extends React.Component {
  render() {
    const { room } = this.props;
    const { name, topic } = room;
    return <section className={classnames({"room--favorite": room.starred})}>
      <header>
        <div className="header-info">
          <h2>
            <span>{name}</span>
            <span className="icon icon--favorite"><FavoriteIcon /></span>
          </h2>
          <h3>{topic}</h3>
        </div>
      </header>
      <section className="panel panel--contrast">
      </section>
    </section>;
  }
}
