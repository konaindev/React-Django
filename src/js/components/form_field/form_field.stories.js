import React from "react";
import { storiesOf } from "@storybook/react";

import Input from "../input";

import FormField from "./index";

const style = {
  background: "#fff",
  width: "400px",
  margin: "20px auto",
  padding: "20px"
};

storiesOf("FormFiled", module)
  .add("default", () => (
    <div style={style}>
      <FormField label="Confirm Password" Input={Input} type="password" />
    </div>
  ))
  .add("error", () => (
    <div style={style}>
      <FormField
        label="Confirm Password"
        error="Passwords must match"
        showError={true}
        Input={Input}
        type="password"
      />
    </div>
  ))
  .add("ok", () => (
    <div style={style}>
      <FormField
        label="Confirm Password"
        showError={true}
        Input={Input}
        type="password"
      />
    </div>
  ))
  .add("error without icon", () => (
    <div style={style}>
      <FormField
        label="Confirm Password"
        error="Passwords must match"
        showError={true}
        Input={Input}
        type="password"
        showIcon={false}
      />
    </div>
  ))
  .add("ok without icon", () => (
    <div style={style}>
      <FormField
        label="Confirm Password"
        showError={true}
        Input={Input}
        type="password"
        showIcon={false}
      />
    </div>
  ))
  .add("inline", () => (
    <div style={style}>
      <FormField label="Confirm Password" theme="inline">
        <Input type="password" />
      </FormField>
    </div>
  ));
