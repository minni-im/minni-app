
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M178.184,194.321h-66.258L256.002,50l144.072,144.321h-66.256v181.323H178.184V194.321z M375.236,346.828V412H136.764v-65.172h-50V462h338.473V346.828H375.236z"/>
</svg>;
  }
}
