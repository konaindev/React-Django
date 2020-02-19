import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import Collapsible from "./index";
import { props } from "./props";

storiesOf("Collapsible", module)
  .add("default", () => <Collapsible {...props} trigger="Collapsible row" />)
  .add("open", () => (
    <Collapsible {...props} trigger="Collapsible row" isOpen={true} />
  ))
  .add("with icon", () => <Collapsible {...props} />)
  .add(
    "without trigger",
    withState({ isOpen: true })(({ store }) => (
      <>
        <Collapsible isOpen={store.state.isOpen}>{props.children}</Collapsible>
        <button
          style={{
            marginTop: "10px",
            color: "white"
          }}
          onClick={() => {
            store.set({ isOpen: !store.state.isOpen });
          }}
        >
          Collapsible row
        </button>
      </>
    ))
  );
