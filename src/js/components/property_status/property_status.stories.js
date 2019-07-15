import React from "react";
import { storiesOf } from "@storybook/react";

import PropertyStatus from "./index";

storiesOf("PropertyStatus", module)
  .add("OFF TRACK", () => <PropertyStatus performance_rating={0} />)
  .add("AT RISK", () => <PropertyStatus performance_rating={1} />)
  .add("ON TRACK", () => <PropertyStatus performance_rating={2} />)
  .add("CAMPAIGN PENDING", () => <PropertyStatus performance_rating={-1} />)
  .add("All", () => (
    <React.Fragment>
      <PropertyStatus performance_rating={0} />
      <PropertyStatus performance_rating={1} />
      <PropertyStatus performance_rating={2} />
      <PropertyStatus performance_rating={-1} />
    </React.Fragment>
  ));
