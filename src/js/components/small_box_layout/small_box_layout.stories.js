import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { SmallBoxLayout } from "./index";
import props from "./props";

const ctaProps = { ...props, ctaCallback: () => alert("cta fired") };
const healthProps = { ...props, performanceRating: 1 };
const bothProps = { ...ctaProps, ...healthProps };

storiesOf("SmallBoxLayout", module)
  .add("default", () => <SmallBoxLayout {...props} />)
  .add("cta", () => <SmallBoxLayout {...ctaProps} />)
  .add("health", () => <SmallBoxLayout {...healthProps} />)
  .add("both", () => <SmallBoxLayout {...bothProps} />);
