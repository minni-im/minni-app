import React from "react";
import classnames from "classnames";

import RoomActionCreators from "../actions/RoomActionCreators";

import { FavoriteIcon } from "../utils/IconsUtils";

export default class RoomMessages extends React.Component {
  render() {
    const { room } = this.props;
    const { name, topic } = room;
    return <section className={classnames({"room--favorite": room.starred})}>
      <header>
        <div className="header-info">
          <h2>
            <span>{name}</span>
            <span className="icon icon--favorite" onClick={this._onRoomFavoriteToggle.bind(this)}><FavoriteIcon /></span>
          </h2>
          <h3>{topic}</h3>
        </div>
      </header>
      <section className="panel panel--contrast">
      </section>
    </section>;
  }

  _onRoomFavoriteToggle(event) {
    const { room } = this.props;
    RoomActionCreators.toggleFavorite(room.id, room.starred);
  }
}
