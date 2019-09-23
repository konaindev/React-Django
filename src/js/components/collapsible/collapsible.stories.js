import React from "react";
import { storiesOf } from "@storybook/react";

import Collapsible from "./index";
import { props } from "./props";

storiesOf("Collapsible", module)
  .add("default", () => <Collapsible {...props} trigger="Collapsible row" />)
  .add("open", () => (
    <Collapsible {...props} trigger="Collapsible row" isOpen={true} />
  ))
  .add("with icon", () => <Collapsible {...props} />);
