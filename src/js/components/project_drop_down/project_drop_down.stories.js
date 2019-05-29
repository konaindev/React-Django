import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ProjectDropDown from "./index";

const project = { name: "Portland Multi Family", public_id: "pro_example" };

const propsWithoutImage = {
  project: {
    ...project,
    building_logo: null
  }
};

const propsWithImage = {
  project: {
    ...project,
    building_logo: [
      "assets/remarkably-logo-green.svg",
      "assets/remarkably-logo-green.svg",
      "assets/remarkably-logo-green.svg"
    ]
  }
};

storiesOf("ProjectDropDown", module).add("without building logo", () => (
  <ProjectDropDown {...propsWithoutImage} />
));

storiesOf("ProjectDropDown", module).add("with building logo", () => (
  <ProjectDropDown {...propsWithImage} />
));
