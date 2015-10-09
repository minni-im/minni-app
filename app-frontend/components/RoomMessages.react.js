import React from "react";

export default class RoomMessages extends React.Component {
  render() {
    const { room } = this.props;
    const { name, topic } = room;
    return <section>
      <header>
        <div className="header-info">
          <h2>{name}</h2>
          <h3>{topic}</h3>
        </div>
      </header>
      <section className="panel panel--contrast">
        
      </section>
    </section>;
  }
}
