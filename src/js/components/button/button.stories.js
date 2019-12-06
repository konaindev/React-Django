import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "./index";

const clickHandler = () => {
  action("click")();
};

storiesOf("Button", module)
  .add("default", () => <Button onClick={clickHandler}>Default Button</Button>)
  .add("primary", () => (
    <Button color="primary" onClick={clickHandler}>
      Primary Button
    </Button>
  ))
  .add("disabled", () => (
    <Button.DisableWrapper isDisable={true}>
      <Button color="disabled" onClick={clickHandler}>
        Disabled Button
      </Button>
    </Button.DisableWrapper>
  ))
  .add("secondary", () => (
    <Button color="secondary" onClick={clickHandler}>
      Secondary Button
    </Button>
  ))
  .add("outline", () => (
    <Button color="outline" onClick={clickHandler}>
      Outline Button
    </Button>
  ))
  .add("disabled-light", () => (
    <Button.DisableWrapper isDisable={true}>
      <Button color="disabled-light" onClick={clickHandler}>
        Disabled Light Button
      </Button>
    </Button.DisableWrapper>
  ))
  .add("transparent", () => (
    <Button color="transparent" onClick={clickHandler}>
      Transparent Button
    </Button>
  ))
  .add("selected", () => (
    <Button selected onClick={clickHandler}>
      Selected Button
    </Button>
  ))
  .add("warning", () => (
    <Button color="warning" onClick={clickHandler}>
      Warning Button
    </Button>
  ));
