import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Button from "./index";

storiesOf("Button", module)
  .add("default", () => <Button>Default Button</Button>)
  .add("primary", () => <Button color="primary">Primary Button</Button>)
  .add("disabled", () => <Button color="disabled">Disabled Button</Button>)
  .add("secondary", () => <Button color="secondary">Secondary Button</Button>)
  .add("outline", () => <Button color="outline">Outline Button</Button>)
  .add("disabled-light", () => (
    <Button color="disabled-light">Disabled Light Button</Button>
  ))
  .add("transparent", () => (
    <Button color="transparent">Transparent Button</Button>
  ))
  .add("selected", () => <Button selected>Selected Button</Button>)
  .add("warning", () => <Button color="warning">Warning Button</Button>);
