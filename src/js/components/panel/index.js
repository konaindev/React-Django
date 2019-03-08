import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./panel.scss";

/**
 * @class Panel
 *
 * @classdesc A simple panel with ligtened background, border-radius and box shadow
 *
 */
export default class Panel extends Component {
  static propTypes = {
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    size: PropTypes.oneOf(["small", "default"])
  };

  static defaultProps = {
    component: "div",
    size: "default"
  };

  render() {
    const {
      className,
      component: WrapperComponent,
      size,
      ...props
    } = this.props;

    return (
      <WrapperComponent
        className={cn("panel", `panel--${size}`, className)}
        {...props}
      />
    );
  }
}
