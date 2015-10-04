import React from "react";

class MinniPanel extends React.Component {

  render() {
    const { children } = this.props;
    return <div className="minni-app">
      {children ? children.sidebar : false}
      {children.content}
    </div>;
  }

  renderHeader() {
    return <header>
      <h1>Minni</h1>
      <nav>
        <Link to="/lobby" className="lobby" activeClassName="selected">
          <span className="icon"></span>
          <span className="name">Lobby</span>
        </Link>
      </nav>
      <UserInfoPanel />
    </header>;
  }

}

export default MinniPanel;
