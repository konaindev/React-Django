import React from "react";

import { storiesOf } from "@storybook/react";

import ButtonLink from "./index";

storiesOf("ButtonLink", module).add("default", () => (
  <ButtonLink link="https://remarkably.io/" target="_blank" />
));
