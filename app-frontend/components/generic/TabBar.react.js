import React from "react";
import classnames from "classnames";

export function TabPanel(props) {
  return <div>TabPanel should be used from TabBar</div>;
}

TabPanel.propTypes = {
  label: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  onChange: React.PropTypes.func
};

export default class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  render() {
    let tab;
    const tabNav = React.Children.map(this.props.children, (child, index) => {
      if (child.type.name !== "TabPanel") {
        return false;
      }
      let classNames = { "x-tab": true };
      if (this.state.selected === index) {
        classNames["x-tab-selected"] = true;
        tab = child;
      }
      return <a
        key={"xtb-" + index}
        className={classnames(classNames)}
        data-index={index}>{child.props.label}</a>;
    });

    let tabClassNames = {
      "x-tab-content": true
    };
    if (tab.props.className) {
      tabClassNames[tab.props.className] = true;
    }

    return <div className={classnames(this.props.className, "x-tabbar")}>
      <nav className="x-tabs" onClick={this._onNavClicked.bind(this)}>{tabNav}</nav>
      <div className={classnames(tabClassNames)} onChange={tab.props.onChange}>{tab.props.children}</div>
    </div>;
  }

  _onNavClicked(event) {
    const { target } = event;
    if (target.dataset.index) {
      const index = parseInt(target.dataset.index, 10);
      this.setState({ "selected": index });
    }
  }
}

TabBar.propTypes = {
  selected: React.PropTypes.number/*,
  children: React.PropTypes.arrayOf(React.PropTypes.instanceOf(TabPanel))*/
};

TabBar.defaultProps = {
  selected: 0
};