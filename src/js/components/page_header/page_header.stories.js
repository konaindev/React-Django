import React from "react";
import { storiesOf } from "@storybook/react";

import { props } from "../top_navigation/props";

import PageHeader from "./index";

storiesOf("PageHeader", module)
  .add("default", () => <PageHeader>header content</PageHeader>)
  .add("Nav link", () => (
    <PageHeader navLinks={props}>header content</PageHeader>
  ));
