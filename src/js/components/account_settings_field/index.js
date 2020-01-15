import { ErrorMessage } from "formik";
import React from "react";

const AccountSettingsField = ({ name, label, children }) => (
  <div className="account-settings-field">
    <div className="account-settings-field__label">{label}</div>
    {children}
    <div className="account-settings-field__error">
      <ErrorMessage name={name} />
    </div>
  </div>
);
AccountSettingsField.propTypes = {};
