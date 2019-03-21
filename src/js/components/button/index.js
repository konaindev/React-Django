import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./button.scss";

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    selected: PropTypes.bool,
    fullWidth: PropTypes.bool,
    uppercase: PropTypes.bool,
    color: PropTypes.oneOf(["default", "primary"]),
    onClick: PropTypes.func
  };

  render() {
    const {
      children,
      className,
      color,
      onClick,
      selected,
      fullWidth,
      uppercase,
      ...buttonProps
    } = this.props;
    return (
      <button
        className={cn(
          "button",
          {
            "button--selected": selected,
            "button--block": fullWidth,
            "button--uppercase": uppercase
          },
          `button-${color}`,
          className
        )}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}
