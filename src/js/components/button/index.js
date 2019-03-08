import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./button.scss";

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    selected: PropTypes.bool,
    onClick: PropTypes.func
  };

  render() {
    const {
      children,
      className,
      onClick,
      selected,
      ...buttonProps
    } = this.props;
    return (
      <button
        className={cn("button", { "button--selected": selected }, className)}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}
