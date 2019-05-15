import React from "react";
import { storiesOf } from "@storybook/react";
import PropertyRow from "./index";
import { props } from "./props";

storiesOf("PropertyRow", module).add("default", () => (
  <PropertyRow {...props} />
));
