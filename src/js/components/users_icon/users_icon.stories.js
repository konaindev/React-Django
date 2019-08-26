import React from "react";
import { storiesOf } from "@storybook/react";

import UsersIcon from "./index";
import { props } from "./props";

storiesOf("UsersIcon", module).add("default", () => (
  <UsersIcon style={{ borderColor: "#181d23" }} {...props} />
));
