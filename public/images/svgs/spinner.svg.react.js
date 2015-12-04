
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 32 32" : this.props['viewBox']} width={'undefined' === typeof this.props['width'] ? "32" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "32" : this.props['height']} fill={'undefined' === typeof this.props['fill'] ? "white" : this.props['fill']}>
  <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4"/>
  <path d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z"/>
</svg>;
  }
}
