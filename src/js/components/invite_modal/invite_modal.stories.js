import React from "react";
import { storiesOf } from "@storybook/react";

import InviteModal from "./index";
import { props, multiProps } from "./props";

storiesOf("InviteModal", module)
  .add("default", () => <InviteModal {...props} />)
  .add("Multiple properties", () => <InviteModal {...multiProps} />);
