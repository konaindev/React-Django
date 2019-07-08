import React from "react";
import { storiesOf } from "@storybook/react";

import UserMenu from "./index";
import { props } from "./props";

storiesOf("UserMenu", module).add("default", () => (
  <div style={{ marginTop: 10, marginLeft: 300 }}>
    <UserMenu {...props} />
  </div>
));
