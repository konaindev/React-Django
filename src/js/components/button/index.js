import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import "./button.scss";

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    fullWidth: PropTypes.bool,
    uppercase: PropTypes.bool,
    color: PropTypes.oneOf([
      "default",
      "primary",
      "outline",
      "disabled",
      "transparent"
    ]),
    onClick: PropTypes.func
  };

  static defaultProps = {
    color: "default",
    disabled: false,
    onClick: () => {}
  };

  handleClick = () => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick();
    }
  };

  render() {
    const {
      children,
      className,
      color,
      onClick,
      disabled,
      selected,
      fullWidth,
      uppercase,
      ...buttonProps
    } = this.props;

    return (
      <button
        className={cx(
          "button",
          {
            "button--disabled": disabled,
            "button--selected": selected,
            "button--block": fullWidth,
            "button--uppercase": uppercase
          },
          `button--${color}`,
          className
        )}
        onClick={this.handleClick}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}
