import React, { Component } from "react";
import classNames from "classnames";

const BACKGROUND = `url(/images/photo-overlay.png),
  url(http://buukkit.appspot.com/img/random.gif)`;

export default class AuthContainer extends Component {
  componentDidMount() {
    this.computeSize();
    this.cloneBackground();
  }

  computeSize() {
    this.blur.style.width = `${this.form.offsetWidth}px`;
    this.blur.style.height = `${this.form.offsetHeight}px`;
  }

  cloneBackground() {
    this.blurBackground.style.backgroundImage =
      this.background.style.backgroundImage;
  }

  render() {
    return (
      <div
        ref={(background) => { this.background = background; }}
        className={classNames(this.props.className)}
        style={{
          backgroundImage: BACKGROUND
        }}
      >
        <main>
          <div
            className="content-blur"
            ref={(blur) => { this.blur = blur; }}
          >
            <div
              ref={(background) => { this.blurBackground = background; }}
              className="content-blur-background"
            />
          </div>
        </main>
        <main>
          <div
            ref={(form) => { this.form = form; }}
            className="content"
          >
            <div className="greetings">
              <img className="logo" src="/images/logo.png" alt={Minni.name} />
            </div>
            <div className="providers">
              <form onSubmit={this.props.onSubmit}>
                {this.props.children}
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
