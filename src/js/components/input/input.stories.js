import { Formik } from "formik";
import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import { default as Input, FormInput } from "./index";

storiesOf("Input", module)
  .add("text", () => <Input placeholder="text" type="text" />)
  .add("form input", () => (
    <Formik>
      <FormInput placeholder="text" type="text" />
    </Formik>
  ));
