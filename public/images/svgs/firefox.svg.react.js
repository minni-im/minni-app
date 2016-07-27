import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 512 512"} {...this.props}><path d="M412 50H100c-27.613 0-50 22.386-50 50v312c0 27.614 22.387 50 50 50h312c27.615 0 50-22.386 50-50V100c0-27.614-22.385-50-50-50zM252.746 387.817c-103.857 0-176.72-116.492-122.562-213.367-1.735-14.921 1.164-27.418 15.236-43.992-.686 13.439 8.061 26.285 15.497 31.921 11.719-2.19 18.88-2.052 30.532.462 7.346-10.929 22.09-19.43 40.248-16.654-12.085 5.726-18.504 18.216-19.632 27.845 1.647 4.192 3.322 13.239 28.364 11.651 6.427-.369 9.279 1.396 11.045 2.775.49 10.438-8.175 15.807-11.463 17.746-5.014 2.957-13.244 7.164-19.764 13.135 0 0 3.585 11.912-1.273 18.215-22.439-8.926-23.124 20.739-1.392 29.05 18.01 6.887 32.652-3.562 41.538-4.922 21.596-3.304 32.078 16.219 22.191 16.987-8.322.646-9.541 1.155-22.495 9.83-13.847 9.273-32.329 10.467-41.692 8.039 36.309 40.062 155.309 4.596 106.035-110.842 8.443 5.322 22.559 25.453 26.982 48.824 4.514-19.932-7.663-87.463-58.54-107.301 15.478-.986 61.404 17.523 79.798 65.418 1.852-16.891-7.809-41.3-16.312-50.67 22.79 9.255 45.111 52.059 45.111 101.37.002 73.121-54.145 144.48-147.452 144.48z" /></svg>;
  }

}