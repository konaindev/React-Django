import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import * as icons from "./index";

const style = {
  color: "#fff",
  fill: "#fff"
};
const story = storiesOf("Icons", module);
Object.keys(icons).map(iconName =>
  story.add(iconName, () => {
    const Icon = icons[iconName];
    return <Icon style={style} />;
  })
);
