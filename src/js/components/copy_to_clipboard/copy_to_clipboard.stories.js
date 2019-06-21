import React from "react";

import { storiesOf } from "@storybook/react";

import { StorybookContainer } from "../../utils/storybook-helper.stories";
import CopyToClipboard from "./index";

storiesOf("CopyToClipboard", module)
  .add("enabled", () => (
    <StorybookContainer>
      <CopyToClipboard textToCopy="Some Text" />
    </StorybookContainer>
  ))
  .add("disabled", () => (
    <StorybookContainer>
      <CopyToClipboard disabled textToCopy="Some Text" />
    </StorybookContainer>
  ));
