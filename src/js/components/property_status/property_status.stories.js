import React from "react";
import { storiesOf } from "@storybook/react";

import PropertyStatus from "./index";

storiesOf("PropertyStatus", module)
  .add("NEEDS REVIEW", () => <PropertyStatus performance_rating={0} />)
  .add("AT RISK", () => <PropertyStatus performance_rating={1} />)
  .add("ON TRACK", () => <PropertyStatus performance_rating={2} />)
  .add("All", () => (
    <React.Fragment>
      <PropertyStatus performance_rating={0} />
      <PropertyStatus performance_rating={1} />
      <PropertyStatus performance_rating={2} />
    </React.Fragment>
  ));