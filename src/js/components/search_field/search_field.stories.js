import React from "react";
import { storiesOf } from "@storybook/react";

import SearchField from "./index";

const style = {
  display: "inline-block",
  padding: "10px 20px",
  margin: "0 10px",
  border: "1px solid"
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
  .add("active", () => <SearchField value="search" />);
