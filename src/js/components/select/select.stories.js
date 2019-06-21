import React, { Component } from "react";

import { storiesOf } from "@storybook/react";

import Select from "./index";
import { props } from "./props";

storiesOf("Select", module).add("default", () => <Select {...props} />);
