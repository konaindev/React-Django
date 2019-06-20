import cn from "classnames";
import PropTypes from "prop-types";
import React from "react";

import "./input.scss";

export default function Input(props) {
  const { className, ...otherProps } = props;
  const classes = cn("input", className);
  return <input className={classes} type={props.type} {...otherProps} />;
}
Input.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};
