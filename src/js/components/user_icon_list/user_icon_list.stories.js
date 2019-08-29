import React from "react";
import { storiesOf } from "@storybook/react";

import UserIconList from "./index";
import { props } from "./props";

storiesOf("UserIconList", module).add("default", () => (
  <UserIconList style={{ borderColor: "#181d23" }} {...props} />
));
