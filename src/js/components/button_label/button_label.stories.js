import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import ButtonLabel from "./index";

const clickHandler = () => {
  action("click")();
};

storiesOf("ButtonLabel", module).add("default", () => (
  <ButtonLabel label="beta" onClick={clickHandler}>
    insights
  </ButtonLabel>
));
