import cn from "classnames";
import { ErrorMessage } from "formik";
import React from "react";

import "./account_settings_field.scss";

const getFieldClasses = (name, errors, touched, modifiers = []) => {
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
    className={cn(getFieldClasses(name, errors, touched, modifiers), className)}
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
AccountSettingsField.propTypes = {};
AccountSettingsField.defaultProps = {
  name: "",
  label: "",
  errors: {},
  touched: {},
  modifiers: []
};

export default AccountSettingsField;
