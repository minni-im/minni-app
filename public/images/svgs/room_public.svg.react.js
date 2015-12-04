
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="m412.77,360.72h-80.987c-0.004-88.142-44.062-46.248-44.062-123.49,0-27.881,18.253-43.014,41.691-43.014,34.629,0,58.73,33.064,25.937,94.892-10.773,20.311,11.472,25.138,35.371,30.651,23.888,5.5093,22.05,18.104,22.05,40.957zm-131.56-51.52c-30.06-6.9335-58.042-13.005-44.49-38.555,41.249-77.768,10.933-119.36-32.625-119.36-44.417,0-73.987,43.186-32.624,119.36,13.958,25.705-15.078,31.77-44.492,38.555-30.048,6.9304-27.736,22.773-27.736,51.519h209.68c-0.00077-28.746,2.3109-44.588-27.738-51.519z"/>
</svg>;
  }
}
