
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M414.25,430V82c0-17.674-14.326-32-32-32h-252.5c-17.673,0-32,14.326-32,32v348c0,17.673,14.327,32,32,32 h252.5C399.924,462,414.25,447.673,414.25,430z M137.75,417V95h236.5v322H137.75z M247.5,439.749c0-4.693,3.806-8.5,8.5-8.5 c4.695,0,8.5,3.807,8.5,8.5c0,4.695-3.805,8.5-8.5,8.5C251.306,448.249,247.5,444.444,247.5,439.749z"/>
</svg>;
  }
}
