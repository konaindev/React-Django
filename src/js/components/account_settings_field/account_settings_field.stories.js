import React from "react";

import { storiesOf } from "@storybook/react";

import Input from "../input";
import AccountSettingsField from "./index";

const style = {
  width: "400px"
};

storiesOf("AccountSettingsField", module).add("default", () => (
  <AccountSettingsField label="Test Field" errorName="field" style={style}>
    <Input className="account-settings-field__input" theme="gray" />
  </AccountSettingsField>
));
