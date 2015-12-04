
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} width={'undefined' === typeof this.props['width'] ? "512px" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "512px" : this.props['height']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']}>
  <path d="M50,64.991v293.682h64.501v88.336l131.978-88.336H462V64.991H50z M256,283.567H121.841v-30H256 V283.567z M391.841,223.567h-270v-30h270V223.567z M391.841,163.567h-270v-30h270V163.567z"/>
</svg>;
  }
}
