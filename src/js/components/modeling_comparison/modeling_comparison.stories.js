import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./ModelingOptions";
import ModelingComparison from "./index";

storiesOf("ModelingComparison", module).add("default", () => (
  <div style={{ margin: "16px auto" }}>
    <ModelingComparison {...props} />
  </div>
));
