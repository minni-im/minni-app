
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} width={'undefined' === typeof this.props['width'] ? "512px" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "512px" : this.props['height']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']}>
  <path d="M462,283.742v-55.485l-49.249-17.514c-3.4-11.792-8.095-23.032-13.919-33.563l22.448-47.227 l-39.234-39.234l-47.226,22.449c-10.53-5.824-21.772-10.52-33.564-13.919L283.741,50h-55.484l-17.515,49.25 c-11.792,3.398-23.032,8.094-33.563,13.918l-47.227-22.449l-39.234,39.234l22.45,47.227c-5.824,10.531-10.521,21.771-13.919,33.563 L50,228.257v55.485l49.249,17.514c3.398,11.792,8.095,23.032,13.919,33.563l-22.45,47.227l39.234,39.234l47.227-22.449 c10.531,5.824,21.771,10.52,33.563,13.92L228.257,462h55.484l17.515-49.249c11.792-3.398,23.034-8.095,33.564-13.919l47.226,22.448 l39.234-39.234l-22.448-47.226c5.824-10.53,10.521-21.772,13.919-33.564L462,283.742z M256,331.546 c-41.724,0-75.548-33.823-75.548-75.546s33.824-75.547,75.548-75.547c41.723,0,75.546,33.824,75.546,75.547 S297.723,331.546,256,331.546z"/>
</svg>;
  }
}
