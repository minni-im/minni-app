
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path id="edit-4-icon" d="M142.559,400.349H50v-35h92.559V400.349z M384.031,111.651l-188.72,188.381l-23.608,99.521l101.58-21.693 L462,189.479L384.031,111.651z M255.831,345.796l-18.572,3.967l-14.334-14.314l4.195-17.683l156.911-156.63l28.396,28.344 L255.831,345.796z"/>
</svg>;
  }
}