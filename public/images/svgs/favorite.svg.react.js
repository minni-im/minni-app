
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} width={'undefined' === typeof this.props['width'] ? "512px" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "512px" : this.props['height']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']}>
  <polygon points="256,60.082 318.979,190.002 462.001,209.75 357.9,309.793 383.315,451.918 256,383.828 128.685,451.918 154.1,309.793 49.999,209.75 193.021,190.002 "/>
</svg>;
  }
}
