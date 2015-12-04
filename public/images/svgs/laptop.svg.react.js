
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M462,360v13c0,11.046-8.954,20-20,20H70c-11.046,0-20-8.954-20-20v-13h167.088 c1.371,6.149,6.85,9.75,13.412,9.75h51c6.562,0,12.042-3.601,13.412-9.75H462z M399.834,146H112.166v172h287.668V146 M426.835,345 H85.168V139c0-11.046,8.954-20,20-20h301.667c11.046,0,20,8.954,20,20V345z"/>
</svg>;
  }
}
