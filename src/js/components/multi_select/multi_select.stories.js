import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import MultiSelect from "./index";
import { props, propsLong } from "./props";

storiesOf("MultiSelect", module)
  .add("default", () => <MultiSelect {...props} />)
  .add("selected", () => (
    <MultiSelect {...props} value={props.options[1]} menuIsOpen />
  ))
  .add("long text", () => <MultiSelect {...propsLong} menuIsOpen />);
