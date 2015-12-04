
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M462,256c0-113.771-92.229-206-206-206C142.229,50,50,142.229,50,256c0,113.771,92.229,206,206,206 C369.771,462,462,369.771,462,256z M90,256c0-91.74,74.243-166,166-166c91.741,0,166,74.244,166,166c0,91.741-74.243,166-166,166 C164.258,422,90,347.757,90,256z M223.923,364.519c-25.399-7.35-74.153-49.73-74.153-106.521c0-56.791,48.754-99.171,74.153-106.521 V364.519z M289.865,366.839c-2.337-3.373-9.787-14.568-9.787-14.568s18.324-9.715,18.324-33.716 c0-23.332-18.324-33.716-18.324-33.716s7.45-11.195,9.787-14.568c14.444,5.45,38.676,23.283,38.676,48.284 S304.31,361.389,289.865,366.839z M289.865,248.046c-2.337-3.373-9.787-14.568-9.787-14.568s18.324-9.715,18.324-33.716 c0-23.332-18.324-33.716-18.324-33.716s7.45-11.195,9.787-14.568c14.444,5.45,38.676,23.283,38.676,48.284 S304.31,242.596,289.865,248.046z"/>
</svg>;
  }
}
