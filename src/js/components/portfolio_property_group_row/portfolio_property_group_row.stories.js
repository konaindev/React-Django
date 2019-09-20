import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioPropertyGroupRow from "./index";
import { props, withoutKPIs } from "./props";

storiesOf("PortfolioPropertyGroupRow", module)
  .add("default", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyGroupRow {...props} />
    </Container>
  ))
  .add("without KPIs", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PortfolioPropertyGroupRow {...withoutKPIs} />
    </Container>
  ));
