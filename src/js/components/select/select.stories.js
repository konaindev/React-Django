import { Formik } from "formik";
import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import { default as Select, FormSelect } from "./index";
import { props, propsScroll } from "./props";

storiesOf("Select", module)
  .add("default", () => <Select {...props} />)
  .add("form select", () => (
    <Formik>
      <FormSelect {...props} />
    </Formik>
  ))
  .add("Scroll", () => <Select {...propsScroll} />);
