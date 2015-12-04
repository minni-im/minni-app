
import React from 'react';
export default class extends React.Component {
  render() {
    return <svg xmlns={'undefined' === typeof this.props['xmlns'] ? "http://www.w3.org/2000/svg" : this.props['xmlns']} x={'undefined' === typeof this.props['x'] ? "0px" : this.props['x']} y={'undefined' === typeof this.props['y'] ? "0px" : this.props['y']} viewBox={'undefined' === typeof this.props['viewBox'] ? "0 0 512 512" : this.props['viewBox']} enableBackground={'undefined' === typeof this.props['enableBackground'] ? "new 0 0 512 512" : this.props['enableBackground']} width={'undefined' === typeof this.props['width'] ? "300" : this.props['width']} height={'undefined' === typeof this.props['height'] ? "300" : this.props['height']}>
  <path d="M412,50H100c-27.613,0-50,22.386-50,50v312c0,27.614,22.387,50,50,50h312 c27.615,0,50-22.386,50-50V100C462,72.386,439.615,50,412,50z M388.754,278.357H213.965c0.75,26.718,22.223,52.998,52.374,52.998 c24.533,0,38.767-10.29,49.005-28.527h70.913c-18.104,52.613-63.735,84.335-125.161,84.335c-48.266,0-87.719-30.27-106.235-68.144 c-15.469,10.332-46.525,81.977,33.854,56.627l9.27,5.588c-133.565,55.287-87.863-119.164,10.487-198.262 c-17.186,4.824-43.537,22.17-63.922,51.438c11.736-48.69,54.434-96.134,129.844-95.884c52.318-25.447,131.386-29.808,105.062,50.377 l-5.964-8.67c15.529-58.272-45.154-36.832-52.562-28.685C371.632,180.014,391.423,220.818,388.754,278.357z M317.341,242.651 H214.715c0.999-19.977,19.413-47.13,51.624-47.13C296.49,195.521,316.593,219.18,317.341,242.651z"/>
</svg>;
  }
}
