import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";

import PortfolioPropertyGroupRow from "./index";
import { props } from "./props";

storiesOf("PortfolioPropertyGroupRow", module).add("default", () => (
  <Container style={{ margin: "1rem auto" }}>
    <PortfolioPropertyGroupRow {...props} />
  </Container>
));
