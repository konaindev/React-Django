import React from "react";

import { storiesOf } from "@storybook/react";

import CopyToClipboard from "./index";

storiesOf("CopyToClipboard", module)
  .add("enabled", () => <CopyToClipboard textToCopy="Some Text" />)
  .add("disabled", () => <CopyToClipboard disabled textToCopy="Some Text" />);
