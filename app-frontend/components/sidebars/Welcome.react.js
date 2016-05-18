import React from "react";

export default class Welcome extends React.Component {
  render() {
    return <header className="welcome">
      <h1>{Minni.name}</h1>
      <h2>Welcome to {Minni.name}</h2>
      <br />
      <p>You are about to setup a new team organisation.</p>
    </header>;
  }
}
