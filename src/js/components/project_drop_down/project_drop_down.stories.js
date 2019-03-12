import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ProjectDropDown from "./index";

const project = { name: "Portland Multi Family", public_id: "pro_example" };

const props = { project };

storiesOf("ProjectDropDown", module).add("default", () => (
  <ProjectDropDown {...props} />
));
