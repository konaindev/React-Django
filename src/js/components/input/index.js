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

function PhoneInput(props) {
  const parsePattern = /[0-9]+/g;
  let value = props.value;
  if (props.value) {
    const parts = props.value.match(parsePattern);
    if (parts) {
      const number = parts.join("");
      const numberParts = [
        number.slice(0, 3),
        number.slice(3, 6),
        number.slice(6, 10)
      ].filter(v => !!v);
      if (numberParts[0]) {
        value = `(${numberParts[0]})`;
      }
      if (numberParts[1]) {
        value += ` ${numberParts[1]}`;
      }
      if (numberParts[2]) {
        value += `-${numberParts[2]}`;
      }
    }
  }
  return <Input {...props} value={value} />;
}

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

Input.Phone = PhoneInput;
