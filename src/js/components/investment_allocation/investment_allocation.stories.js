import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import InvestmentAllocation from "./index";
import { props, propsFill } from "./props";

storiesOf("InvestmentAllocation", module)
  .add("empty", () => (
    <Container>
      <InvestmentAllocation {...props} />
    </Container>
  ))
  .add("100%", () => (
    <Container>
      <InvestmentAllocation {...propsFill} />
    </Container>
  ));
