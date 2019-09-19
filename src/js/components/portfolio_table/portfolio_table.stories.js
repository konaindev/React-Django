import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioTable from "./index";
import { props, partialKPIs, withoutKPIs } from "./props";

storiesOf("PortfolioTable", module)
  .add("default", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioTable {...props} />
    </Container>
  ))
  .add("without KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioTable {...withoutKPIs} />
    </Container>
  ))
  .add("partial KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioTable {...partialKPIs} />
    </Container>
  ));
