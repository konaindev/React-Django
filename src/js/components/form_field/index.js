import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Error, Ok } from "../../icons";

import "./form_field.scss";

const FormFiled = ({ theme, label, error, touched, Input, ...props }) => {
  const classes = cn("form-field", {
    [`form-field--${theme}`]: theme,
    "form-field--ok": !error && touched,
    "form-field--error": error && touched
  });
  return (
    <div className={classes}>
      <div className="form-field__error">{error}</div>
      <div className="form-field__label">{label}</div>
      <div className="form-field__input-container">
        <Input className="form-field__input" {...props} />
        <Error className="form-field__icon form-field__icon--error" />
        <Ok className="form-field__icon form-field__icon--ok" />
      </div>
    </div>
  );
};

FormFiled.propTypes = {
  theme: PropTypes.oneOf(["", "inline"]),
  label: PropTypes.string.isRequired,
  Input: PropTypes.node.isRequired,
  error: PropTypes.string,
  touched: PropTypes.bool
};

FormFiled.defaultProps = {
  theme: "",
  Input: ({ children }) => children,
  touched: false
};

export default FormFiled;
