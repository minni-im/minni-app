
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M228.224,298.021v-84.045h149.859V172.23L462,256l-83.917,83.77v-41.748H228.224z M300.345,328.076 c-21.779,27.928-55.217,45.403-92.791,45.403c-31.38,0-60.881-12.221-83.07-34.41c-22.19-22.189-34.41-51.69-34.41-83.069 c0-31.38,12.22-60.882,34.409-83.07c22.189-22.189,51.691-34.409,83.071-34.409c37.646,0,71.053,17.53,92.791,45.401h47.34 c-26.162-50.762-79.091-85.475-140.131-85.475C120.54,98.447,50,168.985,50,256c0,87.011,70.54,157.553,157.554,157.553 c61.04,0,113.969-34.715,140.131-85.477H300.345z"/>
</svg>;
  }
}
