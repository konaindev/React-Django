import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import PropertyRow from "./index";
import { props } from "./props";
import Container from "../container";

storiesOf("PropertyRow", module)
  .add("default", () => (
    <Container style={{ margin: "1rem auto" }}>
      <PropertyRow {...props} />
    </Container>
  ))
  .add(
    "Selection mode",
    withState({ selected: [false, true] })(({ store }) => (
      <Container style={{ margin: "1rem auto" }}>
        <PropertyRow
          {...props}
          selection_mode={true}
          selected={store.state.selected[0]}
          onSelect={value => {
            store.set({ selected: [value, store.state.selected[1]] });
          }}
        />
        <PropertyRow
          {...props}
          selection_mode={true}
          selected={store.state.selected[1]}
          style={{ marginTop: "0.5rem" }}
          onSelect={value => {
            store.set({ selected: [store.state.selected[0], value] });
          }}
        />
      </Container>
    ))
  );
