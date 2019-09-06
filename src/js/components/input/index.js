import cn from "classnames";
import { Field } from "formik";
import PropTypes from "prop-types";
import React from "react";

import "./input.scss";

export default function Input(props) {
  const { className, theme, valueFormatter, ...otherProps } = props;
  const classes = cn("input", className, {
    [`input--${theme}`]: theme
  });
  const value = valueFormatter(otherProps.value);
  return (
    <input
      className={classes}
      type={props.type}
      {...otherProps}
      value={value}
    />
  );
}
Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  theme: PropTypes.oneOf(["", "highlight", "gray"]),
  valueFormatter: PropTypes.func
};
Input.defaultProps = {
  type: "text",
  valueFormatter: v => v
};

export function FormInput(props) {
  const { className, ...otherProps } = props;
  const classes = cn("input", className);
  return (
    <Field
      className={classes}
      type={props.type}
      component="input"
      {...otherProps}
    />
  );
}
FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};
