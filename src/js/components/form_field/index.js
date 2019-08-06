import cn from "classnames";
import React from "react";
import PropTypes from "prop-types";

import { Error, Ok } from "../../icons";

import "./form_field.scss";

const FormFiled = ({ theme, label, error, showError, Input, ...props }) => {
  const classes = cn("form-field", {
    [`form-field--${theme}`]: theme,
    "form-field--ok": !error && showError,
    "form-field--error": error && showError
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
  Input: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  error: PropTypes.string,
  showError: PropTypes.bool
};

FormFiled.defaultProps = {
  theme: "",
  Input: ({ children }) => children,
  showError: false
};

export default FormFiled;
