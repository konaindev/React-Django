import React from "react";
import { storiesOf } from "@storybook/react";

import TopNavigation from "./index";
import { props } from "./props";

storiesOf("TopNavigation", module).add("default", () => (
  <>
    <div style={{ background: "#101417" }}>
      <TopNavigation {...props} />
    </div>
    <div style={{ background: "#181d23", height: "120px" }}></div>
  </>
));
