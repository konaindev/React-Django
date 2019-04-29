import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Button from "./index";

storiesOf("Button", module)
  .add("default", () => <Button>Default Button</Button>)
  .add("primary", () => <Button color="primary">Primary Button</Button>)
  .add("selected", () => <Button selected>Selected Button</Button>);
