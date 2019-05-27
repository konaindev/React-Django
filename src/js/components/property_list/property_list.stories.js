import React from "react";
import { decorate } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";

import PropertyList from "./index";
import { props } from "./props";

const firstArg = decorate([args => args[0]]);

storiesOf("PropertyList", module)
  .add("default", () => <PropertyList {...props} />)
  .add("Selection mode", () => (
    <PropertyList
      {...props}
      selectionMode={true}
      onSelect={firstArg.action("selectedProperties")}
    />
  ));
