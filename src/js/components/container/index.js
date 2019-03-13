import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import "./container.scss";

export const Container = ({ children, className, style }) => (
  <div className={cn("container", className)} style={style}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Container;
