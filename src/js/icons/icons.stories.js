import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import * as icons from "./index";

const defaultStyle = {
  color: "#fff",
  fill: "#fff"
};

const iconsStyles = {
  Add: { fill: "none" }
};

const story = storiesOf("Icons", module);
Object.keys(icons).map(iconName =>
  story.add(iconName, () => {
    const Icon = icons[iconName];
    const iconStyle = iconsStyles[iconName] || {};
    const style = { ...defaultStyle, ...iconStyle };
    return <Icon style={style} />;
  })
);
