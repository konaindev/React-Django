import React from "react";
import { storiesOf } from "@storybook/react";

import { props } from "../top_navigation/props";
import UserMenu from "../user_menu";
import { props as userProps } from "../user_menu/props";

import PageHeader from "./index";

storiesOf("PageHeader", module)
  .add("default", () => (
    <PageHeader>
      <div>ososo</div>header content
    </PageHeader>
  ))
  .add("Nav link", () => (
    <PageHeader navLinks={props}>
      <UserMenu {...userProps} />
    </PageHeader>
  ));
