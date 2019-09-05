import { Formik } from "formik";
import React, { Component } from "react";

import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";

import { default as Input, FormInput } from "./index";

storiesOf("Input", module)
  .add("text", () => <Input placeholder="text" type="text" />)
  .add("form input", () => (
    <Formik>
      <FormInput placeholder="text" type="text" />
    </Formik>
  ))
  .add(
    "phone input",
    withState({ value: "" })(({ store }) => (
      <Input.Phone
        placeholder="(xxx) xxx-xxxx"
        value={store.state.value}
        onChange={e => {
          store.set({ value: e.target.value });
        }}
      />
    ))
  );
