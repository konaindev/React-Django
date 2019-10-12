import React from "react";
import { storiesOf } from "@storybook/react";

import SearchInput from "./index";
import { SearchWithSort } from "./search_with_sort";

const style = {
  width: "400px",
  padding: "2rem"
};

storiesOf("SearchInput", module)
  .add("default", () => (
    <div style={style}>
      <SearchInput placeholder="Search Input" theme="gray" />
    </div>
  ))
  .add("with sort", () => (
    <div style={style}>
      <SearchWithSort placeholder="Search Input" />
    </div>
  ))
  .add("with sort gray", () => (
    <div style={style}>
      <SearchWithSort placeholder="Search Input" theme="gray" />
    </div>
  ))
  .add("with sort highlight", () => (
    <div style={style}>
      <SearchWithSort placeholder="Search Input" theme="highlight" />
    </div>
  ));
