import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import AddPropertyModal from "./index";
import { props } from "./props";

storiesOf("AddPropertyModal", module).add("default", () => (
  <AddPropertyModal open={true} {...props} />
));
