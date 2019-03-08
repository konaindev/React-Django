import React from "react";

import { storiesOf } from "@storybook/react";

import props from "./ModelingOptions";
import ModelingComparison from "./index";

console.log(props);

storiesOf("ModelingComparison", module).add("default", () => (
  <div style={{ height: 560, margin: "16px auto" }}>
    <ModelingComparison {...props} />
  </div>
));
