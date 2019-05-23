import React from "react";
import { storiesOf } from "@storybook/react";

import PropertyRow from "./index";
import { props } from "./props";
import Container from "../container";

storiesOf("PropertyRow", module).add("default", () => (
  <Container style={{ margin: "1rem auto" }}>
    <PropertyRow {...props} />
  </Container>
));
