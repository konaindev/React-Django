import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import Container from "../container";
import PropertyCardList from "./index";
import { props } from "./props";

storiesOf("PropertyCardList", module)
  .add(
    "default",
    withState({ selected: [] })(({ store }) => (
      <Container style={{ margin: "1rem auto" }}>
        <PropertyCardList
          {...props}
          selectedProperties={store.state.selected}
          onSelect={selected => {
            store.set({ selected });
          }}
        />
      </Container>
    ))
  )
  .add("empty", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PropertyCardList properties={[]} />
    </Container>
  ));
