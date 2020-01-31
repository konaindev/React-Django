import React from "react";

import { storiesOf } from "@storybook/react";

import AccountSettingsField from "../account_settings_field";
import Input from "../input";

import ModalForm from "./index";

const data = {
  first: "",
  second: ""
};

storiesOf("ModalForm", module)
  .add("default", () => (
    <ModalForm isOpen={true} title="Test Modal" initialData={data}>
      {() => [
        <>
          <AccountSettingsField label="First Input" errorKey="first">
            <Input className="account-settings-field__input" />
          </AccountSettingsField>
          <AccountSettingsField label="Second Input" errorKey="second">
            <Input className="account-settings-field__input" />
          </AccountSettingsField>
        </>
      ]}
    </ModalForm>
  ))
  .add("light", () => (
    <ModalForm
      theme="light"
      isOpen={true}
      title="Light Modal"
      initialData={data}
    >
      {() => [
        <>
          <AccountSettingsField label="First Input" errorKey="first">
            <Input className="account-settings-field__input" />
          </AccountSettingsField>
          <AccountSettingsField label="Second Input" errorKey="second">
            <Input className="account-settings-field__input" />
          </AccountSettingsField>
        </>
      ]}
    </ModalForm>
  ));
