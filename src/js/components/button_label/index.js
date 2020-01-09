import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./button_label.scss";

export default class ButtonLabel extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: "",
    onClick: () => {}
  };

  render() {
    const classes = cn("button-label", this.props.className);
    return (
      <div className={classes} onClick={this.props.onClick}>
        <div className="button-label__text">{this.props.children}</div>
        <div className="button-label__label">{this.props.label}</div>
      </div>
    );
  }
}
