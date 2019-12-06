import React from "react";
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

import SearchField from "./index";

const style = {
  display: "inline-block",
  padding: "10px 20px",
  margin: "0 10px",
  border: "1px solid"
};

const props_captions = {
  captionClicked: true
};

storiesOf("SearchField", module)
  .add("default", () => (
    <SearchField>
      <div style={style}>field</div>
      <div style={style}>field</div>
      <div style={style}>field</div>
    </SearchField>
  ))
  .add("without children", () => <SearchField />)
  .add("active", () => <SearchField value="search" />)
  .add(
    "caption toggle",
    withState({ captionClicked: true })(({ store }) => (
      <SearchField
        captionClicked={store.state.captionClicked}
        captionSearchToggle={() => {
          store.set({ captionClicked: !store.state.captionClicked });
        }}
      />
    ))
  );
