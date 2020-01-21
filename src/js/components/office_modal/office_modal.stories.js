import React from "react";

import { storiesOf } from "@storybook/react";

import OfficeModal from "./index";

storiesOf("OfficeModal", module).add("default", () => (
  <OfficeModal isOpen={true} />
));
