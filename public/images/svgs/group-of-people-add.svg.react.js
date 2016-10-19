import React from "react";
export default class SVG extends React.Component {
  render() {
    return <svg xmlns={this.props.xmlns ? this.props.xmlns : "http://www.w3.org/2000/svg"} width={this.props.width ? this.props.width : "24"} height={this.props.height ? this.props.height : "24"} viewBox={this.props.viewBox ? this.props.viewBox : "0 0 24 24"} {...this.props}><path d="M.002 20h6.001c-.028-6.542 2.995-3.697 2.995-8.901C8.998 9.09 7.687 8 6 8c-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209C.099 17.392 0 18.12 0 19.381L.002 20zM20.5 13a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 20.5 13zm1.5 4h-1v1h-1v-1h-1v-1h1v-1h1v1h1v1zm-4.814 3H8.003L8 19.171c0-1.679.133-2.649 2.118-3.107 2.243-.518 4.458-.981 3.394-2.945C10.356 7.299 12.611 4 16 4c4.06 0 4.857 4.119 3.085 7.903-1.972.609-3.419 2.428-3.419 4.597 0 1.38.589 2.619 1.52 3.5z" /></svg>;
  }

}