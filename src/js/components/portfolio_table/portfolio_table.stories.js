import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioTable from "./index";
import { props } from "./props";

storiesOf("PortfolioTable", module).add("default", () => (
  <Container style={{ margin: "1rem auto" }}>
    <PortfolioTable {...props} />
  </Container>
));
