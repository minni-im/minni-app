
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M334.832,50H177.168c-18.227,0-33,14.774-33,33v346c0,18.226,14.773,33,33,33h157.664 c18.227,0,33-14.774,33-33V83C367.832,64.774,353.059,50,334.832,50z M238.5,80.222h37c2.209,0,4,1.791,4,4s-1.791,4-4,4h-37 c-2.209,0-4-1.791-4-4S236.291,80.222,238.5,80.222z M257.002,443.056c-8.838,0-16-7.163-16-16s7.162-16,16-16 c8.834,0,16,7.163,16,16S265.836,443.056,257.002,443.056z M342.75,393.75H169.252v-275.5H342.75V393.75z"/>
</svg>;
  }
}
