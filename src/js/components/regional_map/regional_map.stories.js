import React from "react";
import { storiesOf } from "@storybook/react";

import RegionalMap from "./index";

storiesOf("RegionalMap", module)
  .add("default", () => (
    <div style={{ margin: "80px auto" }}>
      <RegionalMap />
    </div>
  ))
  .add("max size", () => <RegionalMap width="100%" height="100%" />);
