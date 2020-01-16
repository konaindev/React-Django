import cn from "classnames";
import { ErrorMessage } from "formik";
import React from "react";

import "./account_settings_field.scss";

const AccountSettingsField = ({
  label,
  errorKey,
  className,
  children,
  ...props
}) => (
  <div className={cn("account-settings-field", className)} {...props}>
    <div className="account-settings-field__label">{label}</div>
    {children}
    <div className="account-settings-field__error">
      <ErrorMessage name={errorKey} />
    </div>
  </div>
);
AccountSettingsField.propTypes = {};

export default AccountSettingsField;
