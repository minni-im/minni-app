
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 100 100" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 100 100" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M50.003,41.593c-12.005,0-21.736,5.804-21.736,17.809h43.475C71.742,47.396,62.009,41.593,50.003,41.593z"/>
  <rect x="23.179" y="62.679" width="53.648" height="7.559"/>
  <path d="M54.63,29.77h-9.252c-1.023,0-1.85,0.826-1.85,1.85v0.225c0,1.022,0.826,1.85,1.85,1.85h2.081v4.862h5.087v-4.862h2.084  c1.02,0,1.849-0.827,1.849-1.85V31.62C56.479,30.596,55.649,29.77,54.63,29.77z"/>
</svg>;
  }
}
