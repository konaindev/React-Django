import React from "react";

import { storiesOf } from "@storybook/react";

import AddTagInput from "./index";
import props from "./props";

storiesOf("AddTagInput", module).add("default", () => (
  <AddTagInput {...props} />
));
