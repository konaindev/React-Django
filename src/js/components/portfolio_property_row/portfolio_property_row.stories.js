import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioPropertyRow from "./index";
import { props } from "./props";

storiesOf("PortfolioPropertyRow", module)
  .add("individual", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyRow {...props} />
    </Container>
  ))
  .add("subproperty", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyRow {...props} type="subproperty" />
    </Container>
  ));
