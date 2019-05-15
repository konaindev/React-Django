import React from "react";
import { storiesOf } from "@storybook/react";

import Container from "../container";
import PropertyCardList from "./index";
import { props } from "./props";

storiesOf("PropertyCardList", module).add("default", () => (
  <Container>
    <PropertyCardList {...props} />
  </Container>
));
