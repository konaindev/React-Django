import React from "react";
import { storiesOf } from "@storybook/react";

import Button from "../button";

import AccountForm from "./index";
import { props } from "./props";
import Input from "../input";

storiesOf("AccountForm", module).add("default", () => (
  <AccountForm {...props}>
    <Input
      className={AccountForm.fieldClass}
      type="password"
      name="password"
      theme="highlight"
    />
    <Button
      className={AccountForm.fieldClass}
      fullWidth={true}
      uppercase={true}
    >
      Set Password
    </Button>
  </AccountForm>
));
