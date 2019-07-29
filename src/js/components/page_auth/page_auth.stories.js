import React from "react";
import { storiesOf } from "@storybook/react";

import PageAuth from "./index";

storiesOf("PageAuth", module)
  .add("default", () => <PageAuth backLink="/">content</PageAuth>)
  .add("without back link", () => <PageAuth>content</PageAuth>);
