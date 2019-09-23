import React from "react";
import { storiesOf } from "@storybook/react";

import UserIconList from "./index";
import { props } from "./props";

storiesOf("UserIconList", module).add("default", () => (
  <div style={{ padding: "100px", background: "#262F38" }}>
    <UserIconList style={{ borderColor: "#262F38" }} {...props} />
  </div>
));
