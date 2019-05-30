import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import AddPropertyForm from "./index";
import { props } from "./props";

storiesOf("AddPropertyForm", module).add("default", () => (
  <AddPropertyForm {...props} />
));
