
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} width={'undefined' === typeof this.props['width'] ? "512px" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "512px" : this.props['height']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']}>
  <path id="lock-18-icon" d="M256,193.663c-73.85,0-133.717,59.867-133.717,133.717S182.15,461.097,256,461.097 c73.852,0,133.717-59.867,133.717-133.717S329.852,193.663,256,193.663z M275.381,329.845c-4.387,4.076-6.881,9.795-6.881,15.785 v22.941h-23V345.63c0-5.986-2.496-11.711-6.881-15.785c-5.302-4.93-8.619-11.963-8.619-19.773c0-14.912,12.088-27,27-27 s27,12.088,27,27C284,317.882,280.683,324.915,275.381,329.845z M204.833,171.831c-18.272,6.021-35.095,15.07-50,26.812v-47.074 c0-55.508,45.159-100.666,100.667-100.666s100.667,45.158,100.667,100.666v46.301c-14.896-11.549-31.688-20.461-50-26.363v-19.938 c0-27.938-22.729-50.666-50.667-50.666s-50.667,22.729-50.667,50.666V171.831z"/>
</svg>;
  }
}
