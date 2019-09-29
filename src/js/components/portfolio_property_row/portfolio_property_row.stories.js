import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioPropertyRow from "./index";
import { props, partialKPIs, withoutKPIs } from "./props";

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
  ))
  .add("without KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyRow {...withoutKPIs} />
    </Container>
  ))
  .add("partial KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyRow {...partialKPIs} />
    </Container>
  ))
  .add("subproperty without KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyRow {...withoutKPIs} type="subproperty" />
    </Container>
  ));
