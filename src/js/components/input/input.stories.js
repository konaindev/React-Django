import { Formik } from "formik";
import React from "react";

import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";

import { formatPhone } from "../../utils/formatters";
import { default as Input, FormInput } from "./index";

storiesOf("Input", module)
  .add("text", () => <Input placeholder="text" type="text" />)
  .add("form input", () => (
    <Formik>
      <FormInput placeholder="text" type="text" />
    </Formik>
  ))
  .add(
    "phone number formatter",
    withState({ value: "" })(({ store }) => (
      <Input
        placeholder="(xxx) xxx-xxxx"
        value={store.state.value}
        valueFormatter={formatPhone}
        onChange={e => {
          store.set({ value: e.target.value });
        }}
      />
    ))
  );
