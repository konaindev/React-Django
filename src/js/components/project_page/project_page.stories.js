import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ProjectPage from "./index";

const props = {
  report: {}
};

storiesOf("ProjectPage", module).add("default", () => (
  <ProjectPage {...props} />
));
