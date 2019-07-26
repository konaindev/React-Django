import React from "react";
import { storiesOf } from "@storybook/react";

import ProjectLink from "./index";
import { props } from "./props";

storiesOf("ProjectLink", module).add("default", () => (
  <ProjectLink {...props} />
));
