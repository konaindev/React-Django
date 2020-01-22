import React from "react";

import { storiesOf } from "@storybook/react";

import OfficeModal from "./index";
import { props } from "./props";

storiesOf("OfficeModal", module).add("default", () => (
  <OfficeModal isOpen={true} {...props} />
));
