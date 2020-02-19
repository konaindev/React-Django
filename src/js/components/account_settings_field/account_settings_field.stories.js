import React from "react";

import { storiesOf } from "@storybook/react";

import AccountSettingsField from "./index";
import Input from "../input";

const style = {
  width: "400px"
};

storiesOf("AccountSettingsField", module)
  .add("default", () => (
    <AccountSettingsField label="Test Field" errorName="field" style={style}>
      <Input className="account-settings-field__input" theme="gray" />
    </AccountSettingsField>
  ))
  .add("light", () => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        padding: "32px",
        backgroundColor: "#fff"
      }}
    >
      <AccountSettingsField
        label="Test Field"
        errorName="field"
        theme="highlight"
        style={style}
      >
        <Input className="account-settings-field__input" theme="highlight" />
      </AccountSettingsField>
    </div>
  ));
