import cn from "classnames";
import { Field } from "formik";
import PropTypes from "prop-types";
import React from "react";

import "./input.scss";

export default function Input(props) {
  const { className, theme, ...otherProps } = props;
  const classes = cn("input", className, {
    [`input--${theme}`]: theme
  });
  return <input className={classes} type={props.type} {...otherProps} />;
}
Input.propTypes = {
  type: PropTypes.string,
  theme: PropTypes.oneOf(["", "highlight", "gray"]),
  className: PropTypes.string
};
Input.defaultProps = {
  type: "text"
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
