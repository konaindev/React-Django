import React from "react";
import { storiesOf } from "@storybook/react";

import AccountSettings from "./index";
import { props } from "./props";

function validateSecurity(values) {
  const errors = {};
  if (values.password && values.password.length < 8) {
    errors.password = { length: "Must be at least 8 characters" };
  }
  return errors;
}

storiesOf("AccountSettings", module)
  .add("Profile", () => <AccountSettings initialTab="profile" {...props} />)
  .add("Account Security", () => (
    <AccountSettings initialTab="lock" validate={validateSecurity} {...props} />
  ))
  .add("Email Reports", () => <AccountSettings initialTab="email" />);
