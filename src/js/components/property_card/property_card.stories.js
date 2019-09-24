import React from "react";
import { storiesOf } from "@storybook/react";

import PropertyCard from "./index";
import { props } from "./props";

storiesOf("PropertyCard", module)
  .add("default", () => <PropertyCard {...props} />)
  .add("selected", () => <PropertyCard {...props} selected={true} />);
