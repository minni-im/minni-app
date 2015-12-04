
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M412,50H100c-27.613,0-50,22.386-50,50v312c0,27.614,22.387,50,50,50h312c27.615,0,50-22.386,50-50V100 C462,72.386,439.615,50,412,50z M384.414,190.089c-32.709,0.012-83.93-0.01-111.67,0c-20.12,0.007-33.111-0.45-47.18,6.952 c-16.538,8.701-29.017,24.83-33.373,43.773L146.62,161.59C213.654,83.616,337.947,99.007,384.414,190.089z M303.877,255.495 c0,26.426-21.499,47.925-47.926,47.925c-26.426,0-47.925-21.499-47.925-47.925c0-26.426,21.499-47.925,47.925-47.925 C282.378,207.569,303.877,229.069,303.877,255.495z M135.186,176.819c15.807,27.532,50.582,88.083,63.744,110.788 c17.242,29.748,48.722,38.608,75.621,30.619l-46.512,78.684C127.537,377.186,79.824,261.621,135.186,176.819z M246.967,399.334 c17.688-29.809,54.18-91.365,65.613-111.066c15.176-26.148,10.295-59.872-12.109-80.698h91.436 C426.002,304.283,350.517,405.714,246.967,399.334z"/>
</svg>;
  }
}
