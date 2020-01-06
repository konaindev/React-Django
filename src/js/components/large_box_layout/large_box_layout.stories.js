import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { LargeBoxLayout } from "./index";
const WIDTH = 420;
const props = {
  name: "Test name",
  content: "Test content",
  detail: "This is details",
  detail2: "This is more details",
  innerBox: null
};

const propsWithBadge = { ...props, performanceRating: 1 };
const propsWithCTA = { ...props, ctaCallback: x => x };
const propsWithBoth = { ...propsWithBadge, ...propsWithCTA };
const propsWithLongName = {
  ...propsWithBoth,
  name: "This is a super long name for testing."
};
storiesOf("LargeBoxLayout", module)
  .add("default", () => (
    <div style={{ width: WIDTH }}>
      <LargeBoxLayout {...props} />
    </div>
  ))
  .add("with health badge", () => (
    <div style={{ width: WIDTH }}>
      <LargeBoxLayout {...propsWithBadge} />
    </div>
  ))
  .add("with CTA", () => (
    <div style={{ width: WIDTH }}>
      <LargeBoxLayout {...propsWithCTA} />
    </div>
  ))
  .add("with health badge and CTA", () => (
    <div style={{ width: WIDTH }}>
      <LargeBoxLayout {...propsWithBoth} />
    </div>
  ))
  .add("with health badge and CTA and long name", () => (
    <div style={{ width: WIDTH }}>
      <LargeBoxLayout {...propsWithLongName} />
    </div>
  ));
