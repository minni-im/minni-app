
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="m 215.78758,234.3467 h -33.14246 v -41.53811 c 0,-40.44839 32.90715,-73.35554 73.35488,-73.35554 40.44839,0 73.35554,32.90715 73.35554,73.35554 v 41.53811 h -33.14246 v -41.53811 c 0,-22.17364 -18.03945,-40.21308 -40.21308,-40.21308 -22.17297,0 -40.21242,18.03944 -40.21242,40.21308 v 41.53811 z m 138.31411,19.88548 V 392.54695 H 157.89831 V 254.23218 h 196.20338 z m -80.20476,58.11001 c 0,-9.88441 -8.01252,-17.89693 -17.89693,-17.89693 -9.88441,0 -17.89693,8.01252 -17.89693,17.89693 0,5.17752 2.19867,9.83933 5.7131,13.10652 2.90659,2.70111 4.56106,6.49592 4.56106,10.46307 v 15.20709 h 15.24554 v -15.20642 c 0,-3.96981 1.65314,-7.76064 4.56106,-10.46308 3.51443,-3.26785 5.7131,-7.92966 5.7131,-13.10718 z"/>
</svg>;
  }
}
