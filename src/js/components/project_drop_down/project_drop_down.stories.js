import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import ProjectDropDown from "./index";

const project = { name: "Portland Multi Family", public_id: "pro_example" };

const propsWithoutImage = {
  project: {
    ...project,
    building_image: null
  }
};

const propsWithImage = {
  project: {
    ...project,
    building_image: {
      thumbnail: "assets/remarkably-logo-green.svg"
    }
  }
};

storiesOf("ProjectDropDown", module).add("without building image", () => (
  <ProjectDropDown {...propsWithoutImage} />
));

storiesOf("ProjectDropDown", module).add("with building image", () => (
  <ProjectDropDown {...propsWithImage} />
));
