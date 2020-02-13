import cn from "classnames";
import { ErrorMessage } from "formik";
import PropTypes from "prop-types";
import React from "react";

import "./account_settings_field.scss";

const getFieldClasses = (name, theme, errors, touched, modifiers = []) => {
  if (theme !== "gray") {
    modifiers = [theme, ...modifiers];
  }
  const classes = modifiers.map(m => `account-settings-field--${m}`);
  const error_dict = {
    "account-settings-field--error": errors[name] && touched[name]
  };
  if (name === "phone") {
    error_dict["account-settings-field--error-country-code"] =
      errors["phone_country_code"] && touched["phone_country_code"];
  }
  return cn("account-settings-field", classes, error_dict);
};

const AccountSettingsField = ({
  className,
  theme,
  name,
  label,
  errorKey,
  errors,
  touched,
  modifiers,
  children,
  ...props
}) => (
  <div
    className={cn(
      getFieldClasses(name, theme, errors, touched, modifiers),
      className
    )}
    {...props}
  >
    <div className="account-settings-field__label">{label}</div>
    {children}
    {name === "phone" && errors["phone_country_code"] ? (
      <div className="account-settings__error">
        <ErrorMessage name="phone_country_code" />
      </div>
    ) : null}
    {errorKey ? (
      <div className="account-settings-field__error">
        <ErrorMessage name={errorKey} />
      </div>
    ) : null}
  </div>
);
AccountSettingsField.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(["gray", "highlight"]),
  name: PropTypes.string,
  errorKey: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.object,
  touched: PropTypes.object,
  modifiers: PropTypes.array
};
AccountSettingsField.defaultProps = {
  name: "",
  label: "",
  theme: "gray",
  errors: {},
  touched: {},
  modifiers: []
};

export default AccountSettingsField;
