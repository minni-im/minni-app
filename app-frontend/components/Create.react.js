import React from "react";

export default class Create extends React.Component {
  render() {
    const { meta } = this.props.children.type;
    return <main className={meta.className}>
      <section>
        <header>
          <div className="header-info">
            <h2>{meta.title}</h2>
            <h3>{meta.description}</h3>
          </div>
        </header>
        { this.props.children }
      </section>
    </main>;
  }
}
