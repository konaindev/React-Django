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
    asDiv: PropTypes.bool,
    color: PropTypes.oneOf([
      "default",
      "primary",
      "secondary",
      "secondary-gray",
      "outline",
      "disabled",
      "disabled-light",
      "transparent",
      "highlight",
      "warning"
    ]),
    onClick: PropTypes.func
  };

  static defaultProps = {
    color: "default",
    disabled: false,
    asDiv: false,
    onClick: () => {}
  };

  handleClick = e => {
    const { disabled, onClick } = this.props;
    if (!disabled) {
      onClick(e);
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
      asDiv,
      ...buttonProps
    } = this.props;

    const Component = asDiv ? "div" : "button";
    return (
      <Component
        className={cx(
          "button",
          {
            "button--div": asDiv,
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
      </Component>
    );
  }
}

const DisableWrapper = ({ className, isDisable, children }) => {
  if (isDisable) {
    const classes = cx("button-disable-wrapper", className);
    return <div className={classes}>{children}</div>;
  } else {
    return children;
  }
};

Button.DisableWrapper = DisableWrapper;
